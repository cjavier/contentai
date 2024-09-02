import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { AuthContext } from '../../AuthContext';

export default function AccountSettings({ onSubmitSuccess, submitButtonText = "Actualizar datos" }) {
  const [formData, setFormData] = useState({
    id: '',
    empresa: '',
    firstname: '',
    lastname: '',
    openaikey: '',
    userId: '',
    openaiModel: '',
    wpWebsiteUrl: '',
    wpUsername: '',
    wpAppPassword: ''
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) return;

    const loadBusinessData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/business/${currentUser.uid}`);
        const businessData = response.data.business; // Accede a la propiedad business
        console.log('Business Data:', businessData); // Verifica los datos
        setFormData({
          id: businessData.id,
          empresa: businessData.empresa || '',
          firstname: businessData.firstname || '',
          lastname: businessData.lastname || '',
          openaikey: businessData.openaikey || '',
          userId: currentUser.uid, // Asigna el userId actual al formData
          openaiModel: businessData.openaiModel || '',
          wpWebsiteUrl: businessData.wpWebsiteUrl || '',
          wpUsername: businessData.wpUsername || '',
          wpAppPassword: businessData.wpAppPassword ? '*'.repeat(businessData.wpAppPassword.length) : ''
        });
      } catch (error) {
        console.error('Error fetching business data:', error);
        // Si no se puede cargar el negocio, asegura que el userId esté en formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          userId: currentUser.uid,
        }));
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

  const handleSelectChange = (e) => {
    setFormData({
      ...formData,
      openaiModel: e.target.value,
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
        empresa: formData.empresa,
        firstname: formData.firstname,
        lastname: formData.lastname,
        openaikey: formData.openaikey,
        userId: formData.userId,
        openaiModel: formData.openaiModel,
        wpWebsiteUrl: formattedUrl,
        wpUsername: formData.wpUsername,
        wpAppPassword: formData.wpAppPassword
      };

      console.log('Submitting data:', businessData, formData.id); // Verifica los datos antes de enviarlos

      if (formData.id) {
        // Si hay un ID, actualiza el negocio existente
        await axios.put(`http://localhost:8000/businesses/${formData.id}`, businessData);
        console.log('Datos de Business actualizados exitosamente.');
      } else {
        // Si no hay un ID, crea un nuevo negocio
        const response = await axios.post('http://localhost:8000/businesses', businessData);
        console.log('Negocio creado exitosamente.');
        // Actualiza el estado con el ID del nuevo negocio creado
        setFormData({
          ...formData,
          id: response.data.id
        });
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error al actualizar o crear los datos de Business:', error);
    }
  };

  useEffect(() => {
    console.log('Form Data:', formData); // Verifica el estado del formulario
  }, [formData]);

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <TextField
          label="Nombre de la empresa"
          name="empresa"
          margin="normal"
          value={formData.empresa}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Tu Nombre"
          name="firstname"
          margin="normal"
          value={formData.firstname}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Apellidos"
          name="lastname"
          margin="normal"
          value={formData.lastname}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="API Key"
          name="openaikey"
          margin="normal"
          value={formData.openaikey}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
        />
        <Select
          label="OpenAI Model"
          name="openaiModel"
          value={formData.openaiModel}
          onChange={handleSelectChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
          <MenuItem value="gpt-4o-mini">gpt-4o-mini</MenuItem>
          <MenuItem value="gpt-4-turbo">gpt-4-turbo</MenuItem>
          <MenuItem value="gpt-4">gpt-4</MenuItem>
          <MenuItem value="gpt-4o">gpt-4o</MenuItem>
        </Select>
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
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          {submitButtonText}
        </Button>
      </Paper>
    </Grid>
  );
}