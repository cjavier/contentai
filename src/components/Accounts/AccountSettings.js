import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { doc, setDoc, getFirestore, collection, getDoc, getDocs, query, where } from 'firebase/firestore'; 
import { AuthContext } from '../../AuthContext'; 

export default function AccountSettings({ onSubmitSuccess, submitButtonText = "Actualizar datos" }) {
    const [formData, setFormData] = useState({
        empresa: '',
        firstname: '',
        lastname: '',
        openaikey: '',
    });

    const { currentUser } = useContext(AuthContext); // Obtener currentUser desde AuthContext

    useEffect(() => {
        const loadBusinessData = async () => {
          if (!currentUser) return;
      
          const db = getFirestore();
          const businessCollection = collection(db, 'Business');
          const q = query(businessCollection, where('userId', '==', currentUser.uid));
          const querySnapshot = await getDocs(q);
      
          if (!querySnapshot.empty) {
            const businessData = querySnapshot.docs[0].data();
            setFormData({
              empresa: businessData.empresa || '',
              firstname: businessData.firstname || '',
              lastname: businessData.lastname || '',
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
              empresa: formData.empresa,
              firstname: formData.firstname,
              lastname: formData.lastname,
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
  

    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Nombre de la empresa"
                    name="empresa"
                    margin="normal"
                    placeholder={formData.empresa || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Tu Nombre"
                    name="firstname"
                    margin="normal"
                    placeholder={formData.firstname || ""}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Apellidos"
                    name="lastname"
                    margin="normal"
                    placeholder={formData.lastname || ""}
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
