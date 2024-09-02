import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'; // Usar axios para llamadas a la API
import { AuthContext } from '../../AuthContext';

export default function BuyerPersonasCreate() {
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    industry: '',
    tone: '',
    language: '',
    maxCharsInTitle: '',
  });

  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { currentUser } = useContext(AuthContext); // Obtener currentUser desde AuthContext

  const handleSubmit = async () => {
    try {
      if (!currentUser) {
        console.error('Usuario no autenticado. No se puede crear el Buyer Persona.');
        return;
      }

      // Crear los prompts basados en los datos del formulario
      const buyerpersona_prompt = `Eres un experto en ${formData.topic}. Estás escribiendo una entrada de blog para tu blog de ${formData.industry}. El tono de escritura será ${formData.tone}. Debes escribir como un bloguero individual con un enfoque personal, así que no uses la primera persona del plural para referirte a ti mismo, por ejemplo, “nuestro”, “nosotros”. Solo usa la primera persona del singular. No uses voz pasiva.`;

      const title_prompt = `Enfócate en ser descriptivo, el título debe describir con precisión de qué trata el contenido y establecer las expectativas del lector. Mantenlo corto y conciso, el título final no debe exceder los ${formData.maxCharsInTitle} caracteres. El título debe estar en ${formData.language}.`;

      const content_prompt = `El contenido debe estar en perfecto ${formData.language} y debe estar escrito en HTML. También resalta las frases importantes en negritas.`;

      // Crear un objeto con los datos del formulario y los prompts
      const buyerPersonaData = {
        userId: currentUser.uid, // Agregar el ID del usuario actual
        name: formData.name,
        topic: formData.topic,
        industry: formData.industry,
        tone: formData.tone,
        language: formData.language,
        maxCharsInTitle: formData.maxCharsInTitle,
        buyerpersona_prompt,
        title_prompt,
        content_prompt,
      };

      // Hacer una solicitud POST a la API para crear el Buyer Persona
      const response = await axios.post('http://localhost:8000/buyerpersona', buyerPersonaData);

      console.log('Buyer Persona creado exitosamente:', response.data);

      // Reload the page after successfully creating the Buyer Persona
      window.location.reload();

      // Realiza cualquier acción adicional después de crear el documento.
    } catch (error) {
      console.error('Error al crear el Buyer Persona:', error);
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <Grid item xs={12}>
      <Accordion expanded={isFormVisible} onChange={toggleFormVisibility}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Crear Buyer Persona</Typography>
        </AccordionSummary>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Nombre del Buyer Persona"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Temas que domina"
            name="topic"
            value={formData.topic}
            onChange={handleInputChange}
          />
          <TextField
            label="Industria"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
          />
          <TextField
            label="Tono de escritura"
            name="tone"
            value={formData.tone}
            onChange={handleInputChange}
          />
          <TextField
            label="Idioma del contenido"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
          />
          <TextField
            label="Máximo de caracteres en el título"
            name="maxCharsInTitle"
            value={formData.maxCharsInTitle}
            onChange={handleInputChange}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Crear Buyer Persona
          </Button>
        </Paper>
      </Accordion>
    </Grid>
  );
}