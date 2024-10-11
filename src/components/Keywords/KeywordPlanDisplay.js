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
import { CallOpenAITitle } from '../OpenAI'; 
import axios from 'axios'; // Importar axios para las solicitudes HTTP

export default function KeywordPlanDisplay({ linkType }) {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }

    const loadKeywordPlans = async () => {
      try {
        // Obtener keyword plans del usuario actual, incluyendo los datos del buyer persona
        const response = await axios.get(`${backendUrl}/keywordplans/user/${currentUser.uid}`);
        const keywordPlansData = response.data.keywordPlans.sort((a, b) => a.planName.localeCompare(b.planName));
        setKeywordPlans(keywordPlansData);
      } catch (error) {
        console.error('Error al cargar los KeywordPlans:', error);
      }
    };

    loadKeywordPlans();
  }, [currentUser]);

  

  return (
    <Grid item xs={12}>
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>
              <Link to={`/${linkType}/${keywordPlan.id}`}>{keywordPlan.planName}</Link>
            </Title>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {keywordPlan.description || 'Sin descripción'} {/* Mostrar la descripción si existe */}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Buyer Persona: {keywordPlan.buyerPersona ? keywordPlan.buyerPersona.name : 'No asignado'} {/* Mostrar el nombre del buyer persona si existe */}
            </Typography>
            
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