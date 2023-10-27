import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; 
import { AuthContext } from '../AuthContext'; 

export default function KeywordsCreate() {
    const [keywords, setKeywords] = React.useState('');
    const [planName, setPlanName] = React.useState('');

    const handleInputChange = (e) => {
      setKeywords(e.target.value);
    };

    const handlePlanNameChange = (e) => {
      setPlanName(e.target.value);
    };
  
    const { currentUser } = useContext(AuthContext);
  
    const handleSubmit = async () => {
      try {
          if (!currentUser) {
              console.error('Usuario no autenticado. No se puede crear el KeywordsPlan.');
              return;
          }
  
          const db = getFirestore();
  
          // Crear un objeto con los datos básicos del KeywordsPlan
          const keywordsPlanData = {
              userId: currentUser.uid,
              planName: planName, // Guardar el nombre del plan como una propiedad
          };
  
          // Usar addDoc para crear el documento y obtener una referencia al documento creado
          const keywordsPlanDocRef = await addDoc(collection(db, 'keywordsplans'), keywordsPlanData);
  
          // Agregar cada keyword como un nuevo documento en la subcolección 'keywords' del KeywordsPlan
          const keywordsArray = keywords.split('\n');
          for (let keyword of keywordsArray) {
              await addDoc(collection(keywordsPlanDocRef, 'keywords'), { keyword });
          }
  
          console.log('KeywordsPlan creado exitosamente.');
  
          // Reload the page after successfully creating the KeywordsPlan
          window.location.reload();
  
      } catch (error) {
          console.error('Error al crear el KeywordsPlan:', error);
      }
  };

  return (
    <Grid item xs={12}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Agregar Nuevo Plan de Keywords</Typography>
        </AccordionSummary>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Nombre del plan de keywords"
            value={planName}
            onChange={handlePlanNameChange}
            placeholder="Escribe el nombre del plan"
          />
          <TextField
            label="Keywords"
            multiline
            rows={4}
            fullWidth
            value={keywords}
            onChange={handleInputChange}
            placeholder="Escribe una keyword por línea"
          />
          <Button variant="contained" onClick={handleSubmit}>
            Crear KeywordsPlan
          </Button>
        </Paper>
      </Accordion>
    </Grid>
  );
}
