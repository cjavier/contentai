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
import Title from './Title';
import { collection, getFirestore, getDocs, query, deleteDoc, where, doc, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';
import { CallOpenAITitle } from '../OpenAI'; 


export default function TitlePlanDisplay({ linkType }) {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedKeywordPlan, setSelectedKeywordPlan] = useState(null);

  

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
  }, [currentUser]);
  const handleDeleteAllTitlesConfirmation = (keywordPlanId) => {
    setSelectedKeywordPlan(keywordPlanId); // Set the selected keyword plan ID for deletion
    setIsPopupVisible(true); // Open the confirmation dialog
  };

  const handleDeleteAllTitles = async (keywordPlanId) => {
    setIsLoading(true); // Show the backdrop
    setBackdropMessage('Eliminando todos los títulos...');
    try {
      const db = getFirestore();
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      const keywordsSnapshot = await getDocs(collection(keywordPlanRef, 'keywords'));

      for (const keywordDoc of keywordsSnapshot.docs) {
        const titlesSnapshot = await getDocs(collection(keywordDoc.ref, 'titles'));
        for (const titleDoc of titlesSnapshot.docs) {
          await deleteDoc(titleDoc.ref);
        }
      }

      console.log('Todos los títulos han sido eliminados.');
      setIsLoading(false);
      // Refresh or update your keywordPlans state if necessary
    } catch (error) {
      console.error('Error al eliminar todos los títulos:', error);
      setIsLoading(false);
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
            {/* Button to delete all titles */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDeleteAllTitles(keywordPlan.id)}
              style={{ marginLeft: '10px' }}
            >
              Eliminar Todos los Títulos del Plan
            </Button>
          </Paper>
        </Grid>
      ))}
      {/* Confirmation Dialog */}
      <Dialog open={isPopupVisible} onClose={() => setIsPopupVisible(false)}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar todos los títulos de este plan de palabras clave?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPopupVisible(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => {
            setIsPopupVisible(false);
            handleDeleteAllTitles(selectedKeywordPlan);
          }} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Backdrop */}
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
        <CircularProgress color="inherit" />
        <Typography style={{ marginTop: 20 }}>{backdropMessage}</Typography>
      </Backdrop>
    </Grid>
  );
}