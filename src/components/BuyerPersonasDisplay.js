import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { collection, getFirestore, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';

export default function BuyerPersonasDisplay() {
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const { currentUser, loading } = useContext(AuthContext);
  const [editingBuyerPersonaId, setEditingBuyerPersonaId] = useState(null);
  const [editingBuyerPersona, setEditingBuyerPersona] = useState({});

  const handleEditBuyerPersonaStart = (buyerPersona) => {
    setEditingBuyerPersonaId(buyerPersona.id);
    setEditingBuyerPersona(buyerPersona);
  };

  useEffect(() => {

  
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los Buyer Personas.');
      return ;
    } 

    const loadBuyerPersonas = async () => {
      try {
        // Obtener la colección de Buyer Personas desde Firestore
        const buyerPersonasCollection = collection(getFirestore(), 'buyerpersonas');

        // Consultar los documentos de Buyer Personas asociados al usuario actual
        const q = query(buyerPersonasCollection, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        // Crear un array para almacenar los datos de los Buyer Personas
        const buyerPersonasData = [];

        querySnapshot.forEach((doc) => {
          // Obtener los datos del documento
          const id = doc.id;
          const data = doc.data();
          const buyerPersona = { id, ...data };
          buyerPersonasData.push(buyerPersona);
        });

        // Establecer los datos en el estado del componente
       // console.log('Estructura de datos de los Buyer Personas:', buyerPersonasData);
        setBuyerPersonas(buyerPersonasData);
      } catch (error) {
        console.error('Error al cargar los Buyer Personas:', error);
      }
    };

    // Cargar los Buyer Personas cuando el componente se monte
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
              <Typography>
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
              <Typography>
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
              <Typography>
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
              <Typography>
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
              <Typography>
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
              <Typography>
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
              <Typography>
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
                  onClick={() => handleDeleteBuyerPersona(buyerPersona.id)} // Add this onClick handler
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
              </Paper>
              </Grid>
              
            ))}
        
      </Grid>
  );
}
