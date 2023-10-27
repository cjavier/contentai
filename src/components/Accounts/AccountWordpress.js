import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { doc, setDoc, getFirestore, collection, getDocs, query, where } from 'firebase/firestore'; 
import { AuthContext } from '../../AuthContext'; 

export default function AccountWordpress({ onSubmitSuccess, submitButtonText = "Guardar Datos de WordPress" }) {
    const [formData, setFormData] = useState({
        wpWebsiteUrl: '',
        wpUsername: '',
        wpAppPassword: ''
    });

    const { currentUser } = useContext(AuthContext);

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
              wpWebsiteUrl: businessData.wpWebsiteUrl || '',
              wpUsername: businessData.wpUsername || '',
              wpAppPassword: businessData.wpAppPassword ? '*'.repeat(businessData.wpAppPassword.length) : ''
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

    const validateAndFormatUrl = (url) => {
        if (!url.startsWith('https://')) {
            alert('Por favor, asegúrate de que el URL comience con "https://".');
            return false;
        }
        if (!url.endsWith('/')) {
            url += '/';
        }
        return url;
    };

    const handleSubmit = async () => {
        try {
            if (!currentUser) {
                console.error('Usuario no autenticado. No se puede actualizar el Business.');
                return;
            }
  
            const formattedUrl = validateAndFormatUrl(formData.wpWebsiteUrl);
            if (!formattedUrl) return;
  
            const businessData = {
                userId: currentUser.uid,
                wpWebsiteUrl: formattedUrl,
                wpUsername: formData.wpUsername,
                wpAppPassword: formData.wpAppPassword
            };
  
          const businessCollection = collection(getFirestore(), 'Business');
          await setDoc(doc(businessCollection, currentUser.uid), businessData, { merge: true });
  
          console.log('Datos de WordPress actualizados exitosamente.');
          if (onSubmitSuccess) {
            onSubmitSuccess(); 
        }
      } catch (error) {
          console.error('Error al actualizar los datos de WordPress:', error);
      }
  };
  

    return (
        <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="URL del Sitio Web de WordPress"
                    name="wpWebsiteUrl"
                    margin="normal"
                    placeholder={formData.wpWebsiteUrl || "https://ejemplo.com/"}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Nombre de Usuario de WordPress"
                    name="wpUsername"
                    margin="normal"
                    placeholder={formData.wpUsername || "Nombre de usuario"}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Contraseña de Aplicación de WordPress"
                    name="wpAppPassword"
                    type="password"
                    margin="normal"
                    placeholder={formData.wpAppPassword || "****"}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={handleSubmit}>
                    {submitButtonText}
                </Button>
                <div style={{ marginTop: '20px' }}>
                    <iframe 
                        width="560" 
                        height="315" 
                        src="https://www.youtube.com/embed/anvquOeerl4" 
                        title="Video de Instrucciones"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </div>
            </Paper>
        </Grid>
    );
}
