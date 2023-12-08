import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'; 
import Title from '../Titles/Title';
import { collection, getFirestore, getDocs, query, where, doc, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';
import { CallOpenAITitle } from '../OpenAI'; 


export default function KeywordPlanDisplay({ linkType }) {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedKeywordPlan, setSelectedKeywordPlan] = useState(null);

  const loadBuyerPersonas = async () => {
    const db = getFirestore();
    const buyerPersonasCollection = collection(db, 'buyerpersonas');
    const q = query(buyerPersonasCollection, where('userId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);
    setBuyerPersonas(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }

    const loadKeywordPlans = async () => {
      try {
        const db = getFirestore();
        const keywordPlansCollection = collection(db, 'keywordsplans');
        const q = query(keywordPlansCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const keywordPlansData = querySnapshot.docs.map(doc => ({ id: doc.id, planName: doc.data().planName }));
        setKeywordPlans(keywordPlansData);
      } catch (error) {
        console.error('Error al cargar los KeywordPlans:', error);
      }
    };

    loadKeywordPlans();
    loadBuyerPersonas(); 
  }, [currentUser]);

  const handleTitleCreationPopup = (keywordPlanId) => {
    setSelectedKeywordPlan(keywordPlanId); // Set the selected keyword plan ID
    setIsPopupVisible(true); // Open the popup
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
  
      // Fetch keywords for the selected keyword plan
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      const keywordsSnapshot = await getDocs(collection(keywordPlanRef, 'keywords'));
      const keywords = keywordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (keywords.length === 0) {
          console.error('No keywords found for the selected keyword plan.');
          setIsLoading(false);
          return;
      }

      for (const keyword of keywords) {
          const titleIdeas = await CallOpenAITitle(keyword.keyword, titlePrompt, currentUser.uid);
          const titlesRef = collection(keywordPlanRef, 'keywords', keyword.id, 'titles');
          for (const titleIdea of titleIdeas) {
              await addDoc(titlesRef, { title: titleIdea });
          }
      }

      console.log('Títulos creados exitosamente.');
      setBackdropMessage('Títulos creados exitosamente');
      setTimeout(() => {
          setIsLoading(false);
          setBackdropMessage('');
      }, 2000);

  } catch (error) {
      console.error('Error al crear títulos:', error);
      setBackdropMessage('Error al crear títulos');
      setTimeout(() => {
          setIsLoading(false);
          setBackdropMessage('');
      }, 2000);
  }
};

 
  

  return (
    <Grid item xs={12}>
      {/* ... (otros componentes y diálogos) */}
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>
                <Link to={`/${linkType}/${keywordPlan.id}`}>{keywordPlan.planName}</Link>
            </Title>
            {/* Button to create titles for the keyword plan */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleTitleCreationPopup(keywordPlan.id)}
            >
              Crear Títulos para el Plan de Keywords
            </Button>
            {/* ... (otros componentes y botones) */}
          </Paper>
        </Grid>
      ))}
      {/* ... (otros componentes y diálogos) */}
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
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
    <CircularProgress color="inherit" />
    <Typography style={{ marginTop: 20 }}>{backdropMessage}</Typography>
</Backdrop>
    </Grid>
  );
}