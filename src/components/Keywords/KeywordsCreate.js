import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'; // Importar axios para las solicitudes HTTP
import { AuthContext } from '../../AuthContext';

export default function KeywordsCreate() {
  const [keywords, setKeywords] = useState('');
  const [planName, setPlanName] = useState('');
  const [description, setDescription] = useState(''); // Estado para la descripción
  const [buyerPersonas, setBuyerPersonas] = useState([]); // Estado para almacenar los buyer personas
  const [selectedBuyerPersona, setSelectedBuyerPersona] = useState(''); // Estado para el buyer persona seleccionado
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchBuyerPersonas = async () => {
      try {
        if (!currentUser) {
          console.error('Usuario no autenticado. No se pueden obtener los Buyer Personas.');
          return;
        }

        // Obtener los buyer personas asociados al usuario actual
        const response = await axios.get(`${backendUrl}/buyerpersonas/${currentUser.uid}`);
        setBuyerPersonas(response.data);

      } catch (error) {
        console.error('Error al obtener los Buyer Personas:', error);
      }
    };

    fetchBuyerPersonas();
  }, [currentUser]);

  const handleInputChange = (e) => {
    setKeywords(e.target.value);
  };

  const handlePlanNameChange = (e) => {
    setPlanName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleBuyerPersonaChange = (e) => {
    setSelectedBuyerPersona(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (!currentUser) {
        console.error('Usuario no autenticado. No se puede crear el KeywordsPlan.');
        return;
      }

      // Crear un objeto con los datos básicos del KeywordsPlan
      const keywordsArray = keywords.split('\n').filter(kw => kw.trim() !== ''); // Eliminar líneas vacías
      const keywordsPlanData = {
        userId: currentUser.uid,
        planName: planName,
        description: description, // Agregar la descripción al objeto
        buyerPersonaId: selectedBuyerPersona, // Asociar el buyer persona seleccionado
        keywords: keywordsArray // Agregar keywords al objeto
      };

      // Usar axios para enviar la solicitud POST al endpoint de creación de KeywordPlan
      const response = await axios.post(`${backendUrl}/keywordplan`, keywordsPlanData);

      console.log('KeywordsPlan creado exitosamente:', response.data);

      // Resetear los campos del formulario
      setPlanName('');
      setDescription(''); // Resetear la descripción
      setKeywords('');
      setSelectedBuyerPersona('');

      // Realizar cualquier acción adicional después de la creación del plan
      // Por ejemplo, navegar a otra página o mostrar una notificación
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
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descripción"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe el plan de keywords"
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <Select
            label="Asociar Buyer Persona"
            value={selectedBuyerPersona}
            onChange={handleBuyerPersonaChange}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>
              Selecciona un Buyer Persona
            </MenuItem>
            {buyerPersonas.map((buyerPersona) => (
              <MenuItem key={buyerPersona.id} value={buyerPersona.id}>
                {buyerPersona.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Keywords"
            multiline
            rows={4}
            fullWidth
            value={keywords}
            onChange={handleInputChange}
            placeholder="Escribe una keyword por línea"
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Crear KeywordsPlan
          </Button>
        </Paper>
      </Accordion>
    </Grid>
  );
}