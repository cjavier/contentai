import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
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
import Title from './Title';
import { collection, getFirestore, getDocs, query, where, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { CallOpenAITitle } from './OpenAI'; 


export default function KeywordsDisplay() {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState(null);
  const [selectedKeywordPlan, setSelectedKeywordPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');


  const showTitleCreationPopup = (keywordPlanId) => {
    setSelectedKeywordPlan(keywordPlanId);
    setIsPopupVisible(true);
  };

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }

    const loadKeywordPlans = async () => {

      try {
        const db = getFirestore();

        // Obtener la colección de KeywordPlans desde Firestore
        const keywordPlansCollection = collection(db, 'keywordsplans');

        // Consultar los documentos de KeywordPlans asociados al usuario actual
        const q = query(keywordPlansCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        const keywordPlansData = [];

        for (const keywordPlanDoc of querySnapshot.docs) {
          const keywordsSnapshot = await getDocs(collection(keywordPlanDoc.ref, 'keywords'));
          
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
        
          keywordPlansData.push(keywordPlan);
        }
    
        setKeywordPlans(keywordPlansData);
      } catch (error) {
        console.error('Error al cargar los KeywordPlans:', error);
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

    loadBuyerPersonas();
    loadKeywordPlans();
  }, [currentUser]);


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
  
  
  
  
  
  

  return (
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

      {/* Keyword list */}
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Keyword Plan: {keywordPlan.id}</Title>
            <Button onClick={() => showTitleCreationPopup(keywordPlan.id)}>Crear Ideas de Títulos</Button>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Keyword</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>Numero de Tìtulos</TableCell>
                  <TableCell sx={{ width: '20%', textAlign: 'right' }}>Delete</TableCell> {/* Ajuste aquí */}
                </TableRow>
              </TableHead>
              <TableBody>
  {keywordPlan.keywords.map((keyword, index) => (
    <TableRow key={index}>
      <TableCell>{keyword.keyword}</TableCell>
      <TableCell sx={{ textAlign: 'right' }}>{keyword.titles ? keyword.titles.length : 0}</TableCell>
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
            <Button onClick={() => handleDeleteKeywordPlan(keywordPlan.id)}>Delete Keyword Plan</Button>
          </Paper>
        </Grid>
      ))}
     <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
    <CircularProgress color="inherit" />
    <Typography style={{ marginTop: 20 }}>{backdropMessage}</Typography>
</Backdrop>
    </Grid>
    
);

}