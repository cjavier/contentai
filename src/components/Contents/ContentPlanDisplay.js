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
import { collection, getFirestore, getDocs, query, deleteDoc, where, doc, addDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';


export default function ContentPlanDisplay({ linkType }) {
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
  

  const handleAllOutlinesCreation = async (keywordPlanId) => {
    setIsLoading(true);
    setBackdropMessage('Programando los Outlines para creación, puedes cerrar el navegador, los contenidos se crearán en segundo plano, vuelve más tarde');
    try {
      const db = getFirestore();
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      await updateDoc(keywordPlanRef, {
        All_Outline_Creation: true
      });
      console.log('All_Outline_Creation marcado como True');

      // Wait for 7 seconds before hiding the backdrop
    setTimeout(() => {
      setIsLoading(false);
      setBackdropMessage('');
    }, 7000); // 7000 milliseconds = 7 seconds

    } catch (error) {
      console.error('Error al marcar All_Outline_Creation:', error);
      setIsLoading(false);
    setBackdropMessage('Ocurrió un error');
    } 
  };
  
  const handleAllContentsCreation = async (keywordPlanId) => {
    setIsLoading(true);
    setBackdropMessage('Programando los Contenidos para creación, puedes cerrar el navegador, los contenidos se crearán en segundo plano, vuelve más tarde');
    try {
      const db = getFirestore();
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      await updateDoc(keywordPlanRef, {
        All_Content_Creation: true
      });
      console.log('All_Content_Creation marcado como True');
      // Wait for 7 seconds before hiding the backdrop
    setTimeout(() => {
      setIsLoading(false);
      setBackdropMessage('');
    }, 7000); // 7000 milliseconds = 7 seconds
    } catch (error) {
      console.error('Error al marcar All_Content_Creation:', error);
      setIsLoading(false);
    setBackdropMessage('Ocurrió un error');
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
              color="primary"
              onClick={() => handleAllOutlinesCreation(keywordPlan.id)}
            >
              Crear todos los Outlines
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAllContentsCreation(keywordPlan.id)}
            >
              Crear todos los Contenidos
            </Button>
          </Paper>
        </Grid>
      ))}
      {/* Confirmation Dialog */}
      {/* Backdrop */}
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
        <CircularProgress color="inherit" />
        <Typography style={{ marginTop: 20 }}>{backdropMessage}</Typography>
      </Backdrop>
    </Grid>
  );
}