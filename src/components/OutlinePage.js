import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Layout from './Layout/Layout';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';

export default function OutlinePage() {
  const { titleId } = useParams();
  const [outline, setOutline] = useState(''); // Cambiado a outline
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se puede cargar el outline.');
      return;
    }

    const fetchOutline = async () => {
      try {
        const response = await fetch(`http://localhost:8000/titles/${titleId}`);
        if (response.ok) {
          const data = await response.json();
          setOutline(data.title.outline || '');
        } else {
          console.error('Error al cargar el outline:', response.statusText);
        }
      } catch (error) {
        console.error('Error al cargar el outline:', error);
      }
    };

    fetchOutline();
  }, [currentUser, titleId]);

  const handleDeleteOutline = async () => {
    try {
      const response = await fetch(`http://localhost:8000/titles/${titleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outline: null }),
      });

      if (response.ok) {
        setOutline('');
      } else {
        console.error('Error al eliminar el outline:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar el outline:', error);
    }
  };


  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:8000/titles/${titleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outline }),
      });

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('Error al guardar el outline editado:', response.statusText);
      }
    } catch (error) {
      console.error('Error al guardar el outline editado:', error);
    }
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              Outline:
            </Typography>
            {isEditing ? (
              <TextareaAutosize
                minRows={20}
                style={{ width: '100%' }}
                value={outline} // Cambiado a outline
                onChange={(e) => setOutline(e.target.value)} // Cambiado a outline
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: outline }} // Cambiado a outline
                style={{ whiteSpace: 'pre-wrap' }}
              ></div>
            )}
            <Button onClick={handleDeleteOutline} color="secondary"> 
              Eliminar Outline
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
