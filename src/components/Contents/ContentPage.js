import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Layout from '../Layout/Layout';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';

export default function ContentPage() {
  const { contentId } = useParams();  
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se puede cargar el contenido.');
      return;
    }

    const fetchContent = async () => {
      try {
        // Obtener el contenido directamente usando el contentId
        const contentResponse = await axios.get(`http://localhost:8000/contents/${contentId}`);
        setContent(contentResponse.data.content.content || '');
      } catch (error) {
        console.error('Error al cargar el contenido:', error);
      }
    };

    fetchContent();
  }, [currentUser, contentId]);

  const handleDeleteContent = async () => {
    try {
      // Eliminar el contenido directamente
      await axios.delete(`http://localhost:8000/contents/${contentId}`);
      setContent('');  // Limpiar el estado después de eliminar el contenido
    } catch (error) {
      console.error('Error al eliminar el contenido:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Actualizar el contenido en la tabla `contents`
      await axios.put(`http://localhost:8000/contents/${contentId}`, {
        content
      });
      setIsEditing(false);  // Salir del modo de edición
    } catch (error) {
      console.error('Error al guardar el contenido editado:', error);
    }
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              Contenido:
            </Typography>
            {isEditing ? (
              <TextareaAutosize
                minRows={20}
                style={{ width: '100%' }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                style={{ whiteSpace: 'pre-wrap' }}
              ></div>
            )}
            <Button onClick={handleDeleteContent} color="secondary">
              Eliminar Contenido
            </Button>
            <Button onClick={() => setIsEditing(!isEditing)} color="primary">
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
            {isEditing && (
              <Button onClick={handleSaveEdit} color="primary">
                Guardar
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}