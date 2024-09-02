import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Title from '../Titles/Title';
import { AuthContext } from '../../AuthContext';
import axios from 'axios'; // Import axios for HTTP requests

export default function ContentPlanDisplay({ linkType }) {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }

    const loadKeywordPlans = async () => {
      try {
        // Fetch keyword plans associated with the current user
        const response = await axios.get(`http://localhost:8000/keywordplans/user/${currentUser.uid}`);
        const keywordPlansData = response.data.keywordPlans.sort((a, b) => a.planName.localeCompare(b.planName));
        setKeywordPlans(keywordPlansData);
      } catch (error) {
        console.error('Error al cargar los KeywordPlans:', error);
      }
    };

    loadKeywordPlans();
  }, [currentUser]);

  const handleAllOutlinesCreation = async (keywordPlanId) => {
    setIsLoading(true);
    setBackdropMessage('Programando los Outlines para creación, puedes cerrar el navegador, los outlines se crearán en segundo plano, vuelve más tarde');
  
    try {
      await axios.put(`http://localhost:8000/keywordplans/${keywordPlanId}`, {
        alloutlinecreation: true
      });
  
      console.log('All_Outline_Creation marcado como True');
  
      setTimeout(() => {
        setIsLoading(false);
        setBackdropMessage('');
      }, 3000);
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
      await axios.put(`http://localhost:8000/keywordplans/${keywordPlanId}`, {
        allcontentcreation: true
      });
  
      console.log('All_Content_Creation marcado como True');
  
      setTimeout(() => {
        setIsLoading(false);
        setBackdropMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error al marcar All_Content_Creation:', error);
      setIsLoading(false);
      setBackdropMessage('Ocurrió un error');
    }
  };

  return (
    <Grid item xs={12}>
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>
              <Link to={`/${linkType}/${keywordPlan.id}`}>{keywordPlan.planName}</Link>
            </Title>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {keywordPlan.description || 'Sin descripción'} {/* Show description if it exists */}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAllOutlinesCreation(keywordPlan.id)}
              sx={{ mb: 1 }}
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
      <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
        <CircularProgress color="inherit" />
        <Typography style={{ marginTop: 20 }}>{backdropMessage}</Typography>
      </Backdrop>
    </Grid>
  );
}