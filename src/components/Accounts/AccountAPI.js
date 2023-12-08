import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { doc, setDoc, getFirestore, collection, getDoc, getDocs, query, where } from 'firebase/firestore'; 
import { AuthContext } from '../../AuthContext'; 

export default function AccountAPI({ onSubmitSuccess, submitButtonText = "Guardar API Key" }) {
    const [formData, setFormData] = useState({
        openaikey: '',
    });

    const { currentUser } = useContext(AuthContext); // Obtener currentUser desde AuthContext
    const [shouldDisplay, setShouldDisplay] = useState(true); // Estado para controlar si se debe mostrar el componente


    useEffect(() => {
        const loadBusinessData = async () => {
          if (!currentUser) {
            setShouldDisplay(false);
            return;
          }
          setShouldDisplay(true);
      
          const db = getFirestore();
          const businessCollection = collection(db, 'Business');
          const q = query(businessCollection, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            const businessData = querySnapshot.docs[0].data();
            // Comprobar si stripe_subscriber es true y actualizar el estado en consecuencia
            if (businessData.stripe_subscriber === "true") {
              setShouldDisplay(false);
              return;
            }
            setFormData({
              openaikey: businessData.openaikey || '',
            });
          }
        };
      
        loadBusinessData();
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
      try {
          if (!currentUser) {
              console.error('Usuario no autenticado. No se puede actualizar el Business.');
              return;
          }
  
          const businessData = {
              userId: currentUser.uid,
              openaikey: formData.openaikey // Guarda la API Key
          };
  
          const businessCollection = collection(getFirestore(), 'Business');
          await setDoc(doc(businessCollection, currentUser.uid), businessData, { merge: true });
  
          console.log('Datos de Business actualizados exitosamente.');
          if (onSubmitSuccess) {
            onSubmitSuccess(); 
        }
      } catch (error) {
          console.error('Error al actualizar los datos de Business:', error);
      }
  };
  
  if (!shouldDisplay) {
    return null;
  }

    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="OpenAI API Key"
                    name="openaikey"
                    type="password" 
                    margin="normal"
                    placeholder="****"
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />
                 <Button variant="contained" onClick={handleSubmit}>
                    {submitButtonText} 
                </Button>
            </Paper>
        </Grid>
    );
}
