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
import { collection, getFirestore, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';

export default function BuyerPersonasDisplay() {
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const { currentUser, loading } = useContext(AuthContext);
  const [editingBuyerPersonaId, setEditingBuyerPersonaId] = useState(null);
  const [editingBuyerPersona, setEditingBuyerPersona] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [contentPrompt, setContentPrompt] = useState('');
  const [promptType, setPromptType] = useState(null);  // Nuevo estado para saber qué prompt se está editando




  const handleEditBuyerPersonaStart = (buyerPersona) => {
    setEditingBuyerPersonaId(buyerPersona.id);
    setEditingBuyerPersona(buyerPersona);
  };

  const handleOpenModal = (buyerPersona, type) => {
    setEditingBuyerPersonaId(buyerPersona.id);
    setEditingBuyerPersona(buyerPersona);
    setPromptType(type);  // Establecer el tipo de prompt (content o buyer persona)
    if (type === 'content') {
      setContentPrompt(buyerPersona.content_prompt);
    } else {
      setContentPrompt(buyerPersona.buyerpersona_prompt);
    }
    setModalOpen(true);
  };
  

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveContentPrompt = async () => {
    if (editingBuyerPersonaId) {
      try {
        const updatedContent = promptType === 'content' 
          ? { ...editingBuyerPersona, content_prompt: contentPrompt }
          : { ...editingBuyerPersona, buyerpersona_prompt: contentPrompt };
        const db = getFirestore();
        const buyerPersonaRef = doc(db, 'buyerpersonas', editingBuyerPersonaId);
        await updateDoc(buyerPersonaRef, updatedContent);
  
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
  

  useEffect(() => {

  
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los Buyer Personas.');
      return ;
    } 

    const loadBuyerPersonas = async () => {
      try {
        const buyerPersonasCollection = collection(getFirestore(), 'buyerpersonas');
        const q = query(buyerPersonasCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const buyerPersonasData = [];
        querySnapshot.forEach((doc) => {
          const id = doc.id;
          const data = doc.data();
          const buyerPersona = { id, ...data };
          buyerPersonasData.push(buyerPersona);
        });
        setBuyerPersonas(buyerPersonasData);
      } catch (error) {
        console.error('Error al cargar los Buyer Personas:', error);
      }
    };
    loadBuyerPersonas();
  }, [currentUser]);

  

  const handleDeleteBuyerPersona = async (buyerPersonaId) => {
    try {
      console.log(buyerPersonaId);
      const buyerPersonaToDelete = buyerPersonas.find((buyerPersona) => buyerPersona.id === buyerPersonaId);
  
      if (!buyerPersonaToDelete) {
        console.error('Buyer Persona no encontrado.');
        return;
      }
  
      const buyerPersonaRef = doc(getFirestore(), 'buyerpersonas', buyerPersonaId);
      await deleteDoc(buyerPersonaRef);
  
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
      const db = getFirestore();
      const buyerPersonaRef = doc(db, 'buyerpersonas', buyerPersonaId);
      await updateDoc(buyerPersonaRef, editingBuyerPersona);
  
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
                                    value={editingBuyerPersona.minWordsInContent}
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
                    <Button variant="outlined" onClick={() => handleOpenModal(buyerPersona)}>Cambiar el Content Prompt</Button>
                        <Button variant="outlined" onClick={() => handleOpenModal(buyerPersona, 'buyerpersona')} sx={{ mt: 1 }}>Cambiar el Buyer Persona Prompt</Button>
                </Paper>
            </Grid>
        ))}
            <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {promptType === 'content' ? 'Cambiar Prompt de Contenido' : 'Cambiar Prompt de Buyer Persona'}
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
