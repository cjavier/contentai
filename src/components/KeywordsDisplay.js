import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddIcon from '@mui/icons-material/Add';
import TitleIcon from '@mui/icons-material/Title';
import Title from './Title';
import { collection, getFirestore, getDocs, query, where, doc, getDoc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { CallOpenAITitle } from './OpenAI'; 
import Layout from './Layout';


export default function KeywordsDisplay() {
  const { keywordPlanId } = useParams();
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState(null);
  const [selectedKeywordPlan, setSelectedKeywordPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const [isAddKeywordModalVisible, setIsAddKeywordModalVisible] = useState(false);
  const [newKeywords, setNewKeywords] = useState('');
  const [editingKeywordId, setEditingKeywordId] = useState(null);
  const [editingKeywordValue, setEditingKeywordValue] = useState('');
  const [keywordsCache, setKeywordsCache] = useState({});
const [buyerPersonasCache, setBuyerPersonasCache] = useState({});


  const handleEditKeywordStart = (keywordId, keywordValue) => {
    setEditingKeywordId(keywordId);
    setEditingKeywordValue(keywordValue);
  };

  const showTitleCreationPopup = (keywordPlanId) => {
    setSelectedKeywordPlan(keywordPlanId);
    setIsPopupVisible(true);
  };
  const handleOpenAddKeywordModal = (keywordPlanId) => {
    setSelectedKeywordPlan(keywordPlanId); // Actualiza el estado con el ID del KeywordPlan
    setIsAddKeywordModalVisible(true);
  };
  

  const handleCloseAddKeywordModal = () => {
    setIsAddKeywordModalVisible(false);
  };

  

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }

    const loadKeywordPlans = async () => {
      if (!currentUser || !keywordPlanId) {
        console.error('Usuario no autenticado o keywordPlanId no proporcionado. No se pueden cargar los KeywordPlans.');
        return;
      }
    
      try {
        const db = getFirestore();
    
        // Obtener una referencia al documento del KeywordPlan específico
        const keywordPlanDocRef = doc(db, 'keywordsplans', keywordPlanId);
    
        // Obtener el documento del KeywordPlan
        const keywordPlanDoc = await getDoc(keywordPlanDocRef);
        if (!keywordPlanDoc.exists()) {
          console.error('El KeywordPlan solicitado no existe.');
          return;
        }
    
        // Cargar las keywords asociadas al KeywordPlan
        const keywordsSnapshot = await getDocs(collection(keywordPlanDocRef, 'keywords'));
        const keywords = [];
        for (const keywordDoc of keywordsSnapshot.docs) {
          const keywordData = {
            id: keywordDoc.id,
            ...keywordDoc.data()
          };
    
          // Recuperar los títulos para esta keyword
          const titlesSnapshot = await getDocs(collection(keywordDoc.ref, 'titles'));
          keywordData.titles = titlesSnapshot.docs.map(titleDoc => titleDoc.data());
    
          keywords.push(keywordData);
        }
    
        const keywordPlan = {
          id: keywordPlanDoc.id,
          ...keywordPlanDoc.data(),
          keywords
        };
    
        setKeywordPlans([keywordPlan]); // Establecer el estado con un array que contiene solo este KeywordPlan
      } catch (error) {
        console.error('Error al cargar el KeywordPlan:', error);
      }
    };

     // Cargar Buyer Personas
     const loadBuyerPersonas = async () => {
      const db = getFirestore();
      const buyerPersonasCollection = collection(db, 'buyerpersonas');
      const q = query(buyerPersonasCollection, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      setBuyerPersonas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    if (!keywordsCache[keywordPlanId]) {
      loadKeywordPlans();
    }
    if (!buyerPersonasCache[currentUser.uid]) {
      loadBuyerPersonas();
    }
  }, [currentUser, keywordPlanId, keywordsCache, buyerPersonasCache]);

  const handleAddKeywords = async () => {
    try {
      if (!currentUser) {
        console.error('Usuario no autenticado. No se pueden agregar keywords.');
        return;
      }
  
      if (!selectedKeywordPlan) {
        console.error('No se ha seleccionado un KeywordPlan.');
        return;
      }
  
      const db = getFirestore();
  
      // Obtener una referencia al KeywordPlan seleccionado
      const keywordsPlanDocRef = doc(db, 'keywordsplans', selectedKeywordPlan);
  
      // Agregar cada keyword como un nuevo documento en la subcolección 'keywords' del KeywordsPlan seleccionado
      const keywordsArray = newKeywords.split('\n');
      const newKeywordsData = [];
      for (let keyword of keywordsArray) {
        const keywordRef = await addDoc(collection(keywordsPlanDocRef, 'keywords'), { keyword });
        newKeywordsData.push({ id: keywordRef.id, keyword });
      }
  
      console.log('Keywords agregadas exitosamente al KeywordPlan.');
  
      // Limpiar el estado de newKeywords y cerrar el modal
      setNewKeywords('');
      setIsAddKeywordModalVisible(false);
  
      // Actualizar el estado directamente con las nuevas keywords
      setKeywordPlans((prevKeywordPlans) =>
        prevKeywordPlans.map((keywordPlan) =>
          keywordPlan.id === selectedKeywordPlan
            ? {
                ...keywordPlan,
                keywords: [...keywordPlan.keywords, ...newKeywordsData],
              }
            : keywordPlan
        )
      );
  
    } catch (error) {
      console.error('Error al agregar keywords al KeywordPlan:', error);
    }
  };
  
  const handleDeleteKeywordPlan = async (keywordPlanId) => {
    try {
      const db = getFirestore();
  
      // Primero, eliminamos todas las keywords asociadas al KeywordPlan
      const keywordsCollectionRef = collection(doc(db, 'keywordsplans', keywordPlanId), 'keywords');
      const keywordsSnapshot = await getDocs(keywordsCollectionRef);
  
      for (const keywordDoc of keywordsSnapshot.docs) {
        await deleteDoc(keywordDoc.ref);
      }
  
      // Luego, eliminamos el KeywordPlan
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      await deleteDoc(keywordPlanRef);
  
      console.log('KeywordPlan eliminado exitosamente.');
  
      // Actualiza el estado eliminando el KeywordPlan
      setKeywordPlans((prevKeywordPlans) =>
        prevKeywordPlans.filter((keywordPlan) => keywordPlan.id !== keywordPlanId)
      );
    } catch (error) {
      console.error('Error al eliminar el KeywordPlan:', error);
    }
  };

  const handleDeleteKeyword = async (keywordPlanId, keywordId) => {
    try {
      if (!keywordPlanId || !keywordId) {
        console.error('Falta keywordPlanId o keywordId:', keywordPlanId, keywordId);
        return;
      }
  
      const db = getFirestore();
  
      // Obtener una referencia al documento de la keyword que deseas eliminar
      const keywordRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId);
  
      // Eliminar el documento de la keyword
      await deleteDoc(keywordRef);
  
      console.log('Keyword eliminada exitosamente.');
  
      // Actualizar el estado eliminando la keyword del keywordPlan correspondiente
      setKeywordPlans((prevKeywordPlans) =>
        prevKeywordPlans.map((keywordPlan) => 
          keywordPlan.id === keywordPlanId 
            ? { ...keywordPlan, keywords: keywordPlan.keywords.filter(keyword => keyword.id !== keywordId) }
            : keywordPlan
        )
      );
    } catch (error) {
      console.error('Error al eliminar la keyword:', error);
    }
  };

  
    

  const handleTitleCreation = async (keywordPlanId) => {
    try {
      setIsLoading(true); // Mostrar el CircularProgress
      setBackdropMessage('Creando títulos...'); // Mensaje mientras se crean los títulos
      const db = getFirestore();
      const selectedBP = buyerPersonas.find(bp => bp.id === selectedBuyerPersona);
      const titlePrompt = selectedBP ? selectedBP.title_prompt : '';
  
      // Si hay un buyer persona seleccionado, actualiza el keywordPlan con el buyerpersonaid
      if (selectedBP) {
        const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
        await updateDoc(keywordPlanRef, {
          buyerpersonaid: selectedBP.id
        });
      }
  
      // Iterar sobre cada keyword en el keywordPlan
      for (const keyword of keywordPlans.find(kp => kp.id === keywordPlanId).keywords) {
        // Llamar a la función CallOpenAITitle para obtener las ideas de títulos
        const titleIdeas = await CallOpenAITitle(keyword.keyword, titlePrompt, currentUser.uid);
  
        // Iterar sobre cada idea de título y guardarla en Firebase
        const titlesRef = collection(doc(db, 'keywordsplans', keywordPlanId, 'keywords', keyword.id), 'titles');
        for (const titleIdea of titleIdeas) {
          await addDoc(titlesRef, { title: titleIdea });
        } 
      }
  
      console.log('Títulos creados exitosamente.');
      setBackdropMessage('Títulos creados exitosamente'); // Mensaje de éxito
      setTimeout(() => {
        setIsLoading(false); // Ocultar el Backdrop después de un breve tiempo
        setBackdropMessage(''); // Limpiar el mensaje
      }, 2000); 
  
    } catch (error) {
      console.error('Error al crear títulos:', error);
      setBackdropMessage('Error al crear títulos'); // Mensaje de error
      setTimeout(() => {
        setIsLoading(false); // Ocultar el Backdrop después de un breve tiempo
        setBackdropMessage(''); // Limpiar el mensaje
      }, 2000); // Puedes ajustar el tiempo según lo que consideres adecuado
    } 
  };

  const handleSaveEditedKeyword = async (keywordPlanId, keywordId) => {
    try {
      const db = getFirestore();
      const keywordRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId);
      await updateDoc(keywordRef, { keyword: editingKeywordValue });
  
      // Actualizar el estado local
      setKeywordPlans((prevKeywordPlans) =>
        prevKeywordPlans.map((keywordPlan) =>
          keywordPlan.id === keywordPlanId
            ? {
                ...keywordPlan,
                keywords: keywordPlan.keywords.map((keyword) =>
                  keyword.id === keywordId
                    ? { ...keyword, keyword: editingKeywordValue }
                    : keyword
                ),
              }
            : keywordPlan
        )
      );
  
      // Resetear el estado de edición
      setEditingKeywordId(null);
      setEditingKeywordValue('');
    } catch (error) {
      console.error('Error al actualizar la keyword:', error);
    }
  };
  
  
  
  
  
  
  

  return (
    <Layout>
    <Grid item xs={12}>
      {/* Diálogo para seleccionar Buyer Persona */}
      <Dialog open={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
        <DialogTitle>Selecciona el Buyer Persona</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, selecciona el Buyer Persona que deseas usar para crear ideas de títulos.
          </DialogContentText>
          <Select
            fullWidth
            value={selectedBuyerPersona}
            onChange={(e) => setSelectedBuyerPersona(e.target.value)}
          >
            {buyerPersonas.map(bp => (
              <MenuItem key={bp.id} value={bp.id}>{bp.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPopupVisible(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
            setIsPopupVisible(false);
            handleTitleCreation(selectedKeywordPlan); // Pasar el keywordPlanId seleccionado
          }} color="primary">
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

       {/* Diálogo para agregar keywords */}
       <Dialog open={isAddKeywordModalVisible} onClose={handleCloseAddKeywordModal}>
        <DialogTitle>Agregar Keywords al Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingresa las keywords que deseas agregar:
          </DialogContentText>
         
          <TextField 
          fullWidth sx={{ m: 1 }}
                    multiline
                    maxRows={8}
                    value={newKeywords}
                    onChange={(e) => setNewKeywords(e.target.value)}
                />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddKeywordModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddKeywords} color="primary">
            Agregar Keywords
          </Button>
        </DialogActions>
      </Dialog>

      {/* Keyword list */}
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Keyword Plan: {keywordPlan.planName}</Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Keyword</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Numero de Tìtulos</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Edit</TableCell> {/* Ajuste aquí */}
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Delete</TableCell> {/* Ajuste aquí */}
                </TableRow>
              </TableHead>
              <TableBody>
  {keywordPlan.keywords.map((keyword, index) => (
    <TableRow key={index}>
      <TableCell>
        {editingKeywordId === keyword.id ? (
          <TextField
            value={editingKeywordValue}
            onChange={(e) => setEditingKeywordValue(e.target.value)}
          />
        ) : (
          keyword.keyword
        )}
      </TableCell>
      <TableCell sx={{ textAlign: 'right' }}>{keyword.titles ? keyword.titles.length : 0}</TableCell>
      <TableCell sx={{ textAlign: 'right' }}>
        {editingKeywordId === keyword.id ? (
          <IconButton
            aria-label="save"
            color="primary"
            onClick={() => handleSaveEditedKeyword(keywordPlan.id, keyword.id)}
          >
            <SaveIcon /> {/* Puedes usar otro ícono si lo prefieres */}
          </IconButton>
        ) : (
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => handleEditKeywordStart(keyword.id, keyword.keyword)}
          >
            <EditIcon />
          </IconButton>
        )}
          </TableCell>
          <TableCell sx={{ textAlign: 'right' }}>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleDeleteKeyword(keywordPlan.id, keyword.id)}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
  ))}
              </TableBody>
            </Table>
            <BottomNavigation showLabels>
              <BottomNavigationAction label="Agregar Keywords" icon={<AddIcon />} onClick={() => handleOpenAddKeywordModal(keywordPlan.id)} />
              <BottomNavigationAction label="Crear Ideas de Títulos" icon={<TitleIcon />} onClick={() => showTitleCreationPopup(keywordPlan.id)} />
              <BottomNavigationAction label="Borrar Keyword Plan" icon={<DeleteIcon />} onClick={() => handleDeleteKeywordPlan(keywordPlan.id)} />
            </BottomNavigation>
          </Paper>
        </Grid>
      ))}
     <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
    <CircularProgress color="inherit" />
    <Typography style={{ marginTop: 20 }}>{backdropMessage}</Typography>
</Backdrop>
    </Grid>
    </Layout>
    
);

}
