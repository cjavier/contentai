import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Layout from './Layout';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';

export default function ContentPage() {
  const { keywordPlanId, keywordId, titleId } = useParams();
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
        const db = getFirestore();
        const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
        const titleDoc = await getDoc(titleRef);

        if (titleDoc.exists()) {
          setContent(titleDoc.data().content || '');
        } else {
          console.error('El título no existe.');
        }
      } catch (error) {
        console.error('Error al cargar el contenido:', error);
      }
    };

    fetchContent();
  }, [currentUser, keywordPlanId, keywordId, titleId]);

  const handleDeleteContent = async () => {
    try {
      const db = getFirestore();
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
      await updateDoc(titleRef, {
        content: null
      });
      setContent('');
    } catch (error) {
      console.error('Error al eliminar el contenido:', error);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const db = getFirestore();
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
      await updateDoc(titleRef, {
        content: content
      });
      setIsEditing(false);
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
