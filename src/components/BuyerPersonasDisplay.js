import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { collection, getFirestore, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';

export default function BuyerPersonasDisplay() {
  const [buyerPersonas, setBuyerPersonas] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los Buyer Personas.');
      return;
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
  

  return (
      <Grid item xs={12}>
      
          <Typography variant="h6">Buyer Personas</Typography>
            {buyerPersonas.map((buyerPersona, index) => (
                <Grid item xs={12} key={index} sx={{ pb: 2 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <div key={index}>
                <Typography>
                  <strong>Nombre:</strong> {buyerPersona.name}
                </Typography>
                <Typography>
                  <strong>Temas que domina:</strong> {buyerPersona.topic}
                </Typography>
                <Typography>
                  <strong>Industria:</strong> {buyerPersona.industry}
                </Typography>
                <Typography>
                  <strong>Idioma:</strong> {buyerPersona.language}
                </Typography>
                <Typography>
                  <strong>Tono de escritura:</strong> {buyerPersona.tone}
                </Typography>
                <Typography>
                  <strong>Maximo de caracteres en el título:</strong> {buyerPersona.maxCharsInTitle}
                </Typography>
                <Typography>
                  <strong>Minimo de palabras en el contenido:</strong> {buyerPersona.minWordsInContent}
                </Typography>
                <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleDeleteBuyerPersona(buyerPersona.id)} // Add this onClick handler
            >
              <DeleteIcon />
            </IconButton>
              </div>
              </Paper>
              </Grid>
              
            ))}
        
      </Grid>
  );
}
