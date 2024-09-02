import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { doc, setDoc, getFirestore, collection, getDoc, getDocs, query, where } from 'firebase/firestore'; 
import { AuthContext } from '../../AuthContext'; 

export default function TitleModel({ onSubmitSuccess, submitButtonText = "Guardar Configuración" }) {
    const [formData, setFormData] = useState({
        openaiModel: '', // New state for storing selected OpenAI model
    });

    const { currentUser } = useContext(AuthContext);
    const [shouldDisplay, setShouldDisplay] = useState(true);

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
            if (businessData.stripe_subscriber === "true") {
              setShouldDisplay(false);
              return;
            }
            setFormData({
              openaiModel: businessData.openaiModel || '', // Load the stored OpenAI model
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
              openaiModel: formData.openaiModel, // Save the selected OpenAI model
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
                <Select
                    label="OpenAI Model"
                    name="openaiModel"
                    value={formData.openaiModel}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
                    <MenuItem value="gpt-4-turbo-preview">gpt-4-vision-preview</MenuItem>
                    <MenuItem value="gpt-4">gpt-4-turbo</MenuItem>
                    <MenuItem value="gpt-4">gpt-4</MenuItem>
                    <MenuItem value="gpt-4">gpt-4o</MenuItem>
                </Select>
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                    {submitButtonText}
                </Button>
            </Paper>
        </Grid>
    );
}
