import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, deleteDoc, updateDoc, deleteField } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Layout from './Layout';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';


export default function ContenidosPage() {
  const { contentId } = useParams();
  const [content, setContent] = useState('');
  const { currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se puede cargar el contenido.');
      return;
    }

    const fetchContent = async () => {
      try {
        const db = getFirestore();
        const contentRef = doc(db, 'contents', contentId);
        const contentDoc = await getDoc(contentRef);

        if (contentDoc.exists()) {
          setContent(contentDoc.data().content || '');
        } else {
          console.error('El contenido no existe.');
        }
      } catch (error) {
        console.error('Error al cargar el contenido:', error);
      }
    };

    fetchContent();
  }, [currentUser, contentId]);

  const handleDeleteContent = async () => {
    try {
      const db = getFirestore();
      
      // Obtener el documento de contenido
      const contentRef = doc(db, 'contents', contentId);
      const contentDoc = await getDoc(contentRef);
      
      if (!contentDoc.exists()) {
        console.error('El contenido no existe.');
        return;
      }
  
      const contentData = contentDoc.data();
      const { keywordPlanId, keywordId, titleId } = contentData;
  
      // Validar que las propiedades existen
      if (!keywordPlanId || !keywordId || !titleId) {
        console.error('Las propiedades necesarias no están presentes en el documento de contenido.');
        return;
      }
  
      // Eliminar el documento de contenido
      await deleteDoc(contentRef);
      
      // Eliminar la propiedad contentId del título correspondiente
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
      await updateDoc(titleRef, {
        contentId: deleteField() // Utilizar deleteField para eliminar la propiedad
      });
  
      // Redirigir o actualizar la UI según sea necesario
      // ...
  
    } catch (error) {
      console.error('Error al eliminar el contenido:', error);
    }
  };
  
  

  const handleSaveEdit = async () => {
    try {
      const db = getFirestore();
      const contentRef = doc(db, 'contents', contentId);
      await updateDoc(contentRef, {
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
