import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';  // Usar axios para las llamadas a la API
import { AuthContext } from '../../AuthContext';

export default function BuyerPersonasDisplay() {
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [editingBuyerPersonaId, setEditingBuyerPersonaId] = useState(null);
  const [editingBuyerPersona, setEditingBuyerPersona] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [contentPrompt, setContentPrompt] = useState('');
  const [promptType, setPromptType] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los Buyer Personas.');
      return;
    }

    const loadBuyerPersonas = async () => {
      try {
        // Usar axios para obtener los Buyer Personas asignados al usuario actual
        const response = await axios.get(`http://localhost:8000/buyerpersonas/${currentUser.uid}`);
        setBuyerPersonas(response.data);
      } catch (error) {
        console.error('Error al cargar los Buyer Personas:', error);
      }
    };

    loadBuyerPersonas();
  }, [currentUser]);

  const handleEditBuyerPersonaStart = (buyerPersona) => {
    setEditingBuyerPersonaId(buyerPersona.id);
    setEditingBuyerPersona(buyerPersona);
  };

  const handleOpenModal = (buyerPersona, type) => {
    setEditingBuyerPersonaId(buyerPersona.id);
    setEditingBuyerPersona(buyerPersona);
    setPromptType(type);
    if (type === 'content') {
      setContentPrompt(buyerPersona.content_prompt);
    } else if (type === 'buyerpersona') {
      setContentPrompt(buyerPersona.buyerpersona_prompt);
    } else if (type === 'title') {
      setContentPrompt(buyerPersona.title_prompt);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveContentPrompt = async () => {
    if (editingBuyerPersonaId) {
      try {
        let updatedContent = {};
        switch (promptType) {
          case 'content':
            updatedContent = { content_prompt: contentPrompt };
            break;
          case 'buyerpersona':
            updatedContent = { buyerpersona_prompt: contentPrompt };
            break;
          case 'title':
            updatedContent = { title_prompt: contentPrompt };
            break;
          default:
            console.error('Tipo de prompt desconocido:', promptType);
            return;
        }

        // Usar axios para actualizar el prompt específico del Buyer Persona
        await axios.put(`http://localhost:8000/buyerpersona/${editingBuyerPersonaId}`, updatedContent);

        // Actualizar el estado local
        setBuyerPersonas((prevBuyerPersonas) =>
          prevBuyerPersonas.map((buyerPersona) =>
            buyerPersona.id === editingBuyerPersonaId ? { ...buyerPersona, ...updatedContent } : buyerPersona
          )
        );

        // Resetear el estado de edición y cerrar el modal
        setEditingBuyerPersonaId(null);
        setEditingBuyerPersona({});
        handleCloseModal();
      } catch (error) {
        console.error('Error al actualizar el prompt:', error);
      }
    } else {
      console.error('No hay un Buyer Persona seleccionado para editar.');
    }
  };

  const handleDeleteBuyerPersona = async (buyerPersonaId) => {
    try {
      // Usar axios para eliminar el Buyer Persona
      await axios.delete(`http://localhost:8000/buyerpersona/${buyerPersonaId}`);

      console.log('Buyer Persona eliminado exitosamente.');

      // Actualiza el estado eliminando el Buyer Persona
      setBuyerPersonas((prevBuyerPersonas) =>
        prevBuyerPersonas.filter((buyerPersona) => buyerPersona.id !== buyerPersonaId)
      );
    } catch (error) {
      console.error('Error al eliminar el Buyer Persona:', error);
    }
  };

  const handleSaveEditedBuyerPersona = async (buyerPersonaId) => {
    try {
      // Asegúrate de que minWordsInContent sea una cadena antes de enviar
      const updatedData = {
        ...editingBuyerPersona,
        minWordsInContent: editingBuyerPersona.minWordsInContent?.toString() || '', // Convertir a string
      };
  
      // Usar axios para actualizar el Buyer Persona
      await axios.put(`http://localhost:8000/buyerpersona/${buyerPersonaId}`, updatedData);
  
      // Actualizar el estado local
      setBuyerPersonas((prevBuyerPersonas) =>
        prevBuyerPersonas.map((buyerPersona) =>
          buyerPersona.id === buyerPersonaId ? editingBuyerPersona : buyerPersona
        )
      );
  
      // Resetear el estado de edición
      setEditingBuyerPersonaId(null);
      setEditingBuyerPersona({});
    } catch (error) {
      console.error('Error al actualizar el Buyer Persona:', error);
    }
  };

  return (
    <Grid item xs={12}>
      <Typography variant="h6">Buyer Personas</Typography>
      {buyerPersonas.map((buyerPersona) => (
        <Grid item xs={12} key={buyerPersona.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <div key={buyerPersona.id}>
              <Typography component="div">
                <strong>Nombre: </strong>
                {editingBuyerPersonaId === buyerPersona.id ? (
                  <TextField
                    value={editingBuyerPersona.name}
                    onChange={(e) => setEditingBuyerPersona({ ...editingBuyerPersona, name: e.target.value })}
                  />
                ) : (
                  buyerPersona.name
                )}
              </Typography>
              <Typography component="div">
                <strong>Temas que domina: </strong>
                {editingBuyerPersonaId === buyerPersona.id ? (
                  <TextField
                    value={editingBuyerPersona.topic}
                    onChange={(e) => setEditingBuyerPersona({ ...editingBuyerPersona, topic: e.target.value })}
                  />
                ) : (
                  buyerPersona.topic
                )}
              </Typography>
              <Typography component="div">
                <strong>Industria: </strong>
                {editingBuyerPersonaId === buyerPersona.id ? (
                  <TextField
                    value={editingBuyerPersona.industry}
                    onChange={(e) => setEditingBuyerPersona({ ...editingBuyerPersona, industry: e.target.value })}
                  />
                ) : (
                  buyerPersona.industry
                )}
              </Typography>
              <Typography component="div">
                <strong>Idioma: </strong>
                {editingBuyerPersonaId === buyerPersona.id ? (
                  <TextField
                    value={editingBuyerPersona.language}
                    onChange={(e) => setEditingBuyerPersona({ ...editingBuyerPersona, language: e.target.value })}
                  />
                ) : (
                  buyerPersona.language
                )}
              </Typography>
              <Typography component="div">
                <strong>Tono de escritura: </strong>
                {editingBuyerPersonaId === buyerPersona.id ? (
                  <TextField
                    value={editingBuyerPersona.tone}
                    onChange={(e) => setEditingBuyerPersona({ ...editingBuyerPersona, tone: e.target.value })}
                  />
                ) : (
                  buyerPersona.tone
                )}
              </Typography>
              <Typography component="div">
                <strong>Máximo de caracteres en el título: </strong>
                {editingBuyerPersonaId === buyerPersona.id ? (
                  <TextField
                    value={editingBuyerPersona.maxCharsInTitle}
                    onChange={(e) => setEditingBuyerPersona({ ...editingBuyerPersona, maxCharsInTitle: e.target.value })}
                  />
                ) : (
                  buyerPersona.maxCharsInTitle
                )}
              </Typography>
              <Typography component="div">
                <strong>Mínimo de palabras en el contenido: </strong>
                {editingBuyerPersonaId === buyerPersona.id ? (
                  <TextField
                    value={editingBuyerPersona.minWordsInContent || ''}
                    onChange={(e) => setEditingBuyerPersona({ ...editingBuyerPersona, minWordsInContent: e.target.value })}
                  />
                ) : (
                  buyerPersona.minWordsInContent
                )}
              </Typography>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => handleDeleteBuyerPersona(buyerPersona.id)}
              >
                <DeleteIcon />
              </IconButton>
              {editingBuyerPersonaId === buyerPersona.id ? (
                <IconButton
                  aria-label="save"
                  color="primary"
                  onClick={() => handleSaveEditedBuyerPersona(buyerPersona.id)}
                >
                  <SaveIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label="edit"
                  color="primary"
                  onClick={() => handleEditBuyerPersonaStart(buyerPersona)}
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>
            <Button variant="outlined" onClick={() => handleOpenModal(buyerPersona, 'content')}>
              Cambiar el Content Prompt
            </Button>
            <Button variant="outlined" onClick={() => handleOpenModal(buyerPersona, 'buyerpersona')} sx={{ mt: 1 }}>
              Cambiar el Buyer Persona Prompt
            </Button>
            <Button variant="outlined" onClick={() => handleOpenModal(buyerPersona, 'title')} sx={{ mt: 1 }}>
              Cambiar el Prompt de Títulos
            </Button>
          </Paper>
        </Grid>
      ))}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {promptType === 'content'
              ? 'Cambiar Prompt de Contenido'
              : promptType === 'buyerpersona'
              ? 'Cambiar Prompt de Buyer Persona'
              : 'Cambiar Prompt de Títulos'}
          </Typography>
  
          <TextField
            multiline
            fullWidth
            rows={4}
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value)}
            variant="outlined"
          />
          <Button onClick={handleSaveContentPrompt} color="primary" variant="contained" sx={{ mt: 2 }}>
            Guardar cambios
          </Button>
        </Box>
      </Modal>
    </Grid>
  ); 
}
