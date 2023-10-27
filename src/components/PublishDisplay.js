import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/CheckCircle';
import PublishIcon from '@mui/icons-material/Publish';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Title from './Title';
import { collection, getFirestore, getDocs, getDoc, query, where, doc, deleteDoc, updateDoc, FieldValue, deleteField } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import Layout from './Layout';



function countWordsInHtml(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') {
    return 0;
  }
  // Eliminar todas las etiquetas HTML
  const text = htmlString.replace(/<[^>]*>/g, '');
  // Dividir el texto por espacios y filtrar cualquier cadena vacía
  const words = text.split(/\s+/).filter(Boolean);
  // Devolver la cantidad de palabras
  return words.length;
}

function CircularProgressWithLabel(props) {
  const percentage = props.value && !isNaN(props.value) ? Math.round(props.value) : 0;
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={percentage} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {`${percentage}%`}
        </Typography>
      </Box>
    </Box>
  );
}



export default function PublishDisplay() {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const [publishedContents, setPublishedContents] = useState(0); // Cambiado de completedOutlines
  const [totalContents, setTotalContents] = useState(0); // Cambiado de totalOutlines
  const navigate = useNavigate();
  const [cachedKeywordPlans, setCachedKeywordPlans] = useState(null);
  const [contents, setContents] = useState([]);
  const { keywordPlanId } = useParams();

  const loadContents = async () => {
    if (!currentUser || !keywordPlanId) {
      console.error('Usuario no autenticado o keywordPlanId no proporcionado. No se pueden cargar los contenidos.');
      return;
    }

    try {
      const db = getFirestore();
      const contentsCollection = collection(db, 'contents');
      console.log("el keyword plan: ",keywordPlanId)
      const q = query(contentsCollection, where('keywordPlanId', '==', keywordPlanId));
      const querySnapshot = await getDocs(q);

      const contentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setContents(contentsData);
    } catch (error) {
      console.error('Error al cargar los contenidos:', error);
    }
  };
  


  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }
    loadContents();
  }, [currentUser, keywordPlanId]); 

  
  const handleContentPublishing = async (contentId) => {
    try {
      const db = getFirestore();
  
      // Obtener los datos de WordPress del negocio asociado al usuario actual
      const businessRef = doc(db, 'Business', currentUser.uid);
      const businessDoc = await getDoc(businessRef);
      const businessData = businessDoc.data();
  
      // Verificar si los datos de WordPress existen
      if (!businessData.wpWebsiteUrl || !businessData.wpUsername || !businessData.wpAppPassword) {
        console.error('Datos de WordPress no configurados.');
        return;
      }
  
      // Obtener el título y el contenido de Firebase
      const contentRef = doc(db, 'contents', contentId);
      const contentDoc = await getDoc(contentRef);
      const contentData = contentDoc.data();
      const title = contentData.title;
      const content = contentData.content;
  
      // Configuración para la API de WordPress usando los datos del negocio
      const url = `${businessData.wpWebsiteUrl}wp-json/wp/v2/posts`;
      const username = businessData.wpUsername;
      const password = businessData.wpAppPassword;
  
      const headers = {
        Authorization: 'Basic ' + btoa(username + ':' + password),
        'Content-Type': 'application/json'
      };
  
      const data = {
        title: title,
        content: content,
        status: 'publish'
      };
  
      // Publicar el contenido en WordPress
      const response = await axios.post(url, data, { headers: headers });
      const postUrl = response.data.link;
      console.log(`Contenido publicado con éxito en: ${postUrl}`);
  
      // Guardar postUrl en Firebase bajo la propiedad 'published'
      await updateDoc(contentRef, {
        published: postUrl
      });
      console.log(`URL del post guardada con éxito en Firebase: ${postUrl}`);  
  
    } catch (error) {
      console.error('Error al publicar el contenido:', error);
    }
  };
  
  const handleAllContentsPublishing = async () => {
    try {
      setIsLoading(true);
      setBackdropMessage('Publicando contenidos...');
  
      setPublishedContents(0);
      setTotalContents(0);
  
      const db = getFirestore();
  
      // Obtener la colección de contenidos desde Firestore
      const contentsCollection = collection(db, 'contents');
  
      // Consultar los documentos de contenidos asociados al keywordPlanId
      const q = query(contentsCollection, where('keywordPlanId', '==', keywordPlanId));
      const querySnapshot = await getDocs(q);
  
      const totalContentsToPublish = querySnapshot.docs.length;
      setTotalContents(totalContentsToPublish);
  
      let publishedCount = 0;
  
      // Recorrer y publicar contenidos
      for (const contentDoc of querySnapshot.docs) {
        const contentId = contentDoc.id;
        await handleContentPublishing(contentId);
        publishedCount++;
        setPublishedContents(publishedCount);
      }
  
      setIsLoading(false);
      console.log('Todos los contenidos han sido publicados con éxito.');
  
    } catch (error) {
      setIsLoading(false);
      console.error('Error al publicar todos los contenidos:', error);
    }
  };
  


  


const handleContentDeletion = async (contentId) => {
  try {
    const db = getFirestore();
    
    // Referencia al documento que deseas eliminar en la colección 'contents'
    const contentRef = doc(db, 'contents', contentId);
    const contentDoc = await getDoc(contentRef);
    const contentData = contentDoc.data();

    // Extraer los IDs necesarios para navegar a la propiedad 'contentId' en el documento 'title'
    const { keywordPlanId, keywordId, titleId } = contentData;

    // Referencia al documento 'title' en el 'keyword' dentro del 'keyword plan'
    const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);

    // Borrar la propiedad 'contentId'
    await updateDoc(titleRef, {
      contentId: deleteField()
    });

    // Eliminar el documento completo en la colección 'contents'
    await deleteDoc(contentRef);
    
    // Recargar los contenidos para reflejar los cambios en la UI
    loadContents();
  } catch (error) {
    console.error('Error al eliminar el contenido:', error);
  }
};



  

  const wrapTextStyle = {
    maxWidth: '150px', // Puedes ajustar este valor según tus necesidades
    whiteSpace: 'normal',
    maxHeight: '60px', // Ajusta según tus necesidades
    overflow: 'auto'   // Esto agregará barras de desplazamiento si el contenido excede el maxHeight
  };
  const inputStyle = {
    width: '100%',
    padding: '5px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };
  
  

  return (
    <Layout>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Plan de Contenido: {keywordPlanId}</Title>
            <Button onClick={() => handleAllContentsPublishing()}>Publicar todos los contenidos</Button>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Número de palabras</TableCell>
                  <TableCell>Publicar</TableCell>
                  <TableCell>Eliminar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contents.map((content, index) => (
                  <TableRow key={index}>
                    <TableCell>{content.title}</TableCell>
                    <TableCell>{countWordsInHtml(content.content)}</TableCell>
                    <TableCell>
                      {content.published ? (
                        <IconButton color="success">
                          <DoneIcon />
                        </IconButton>
                      ) : (
                        <IconButton color="primary" onClick={() => handleContentPublishing(content.id)}>
                          <PublishIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleContentDeletion(content.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgressWithLabel value={(publishedContents / totalContents) * 100} />
        <Typography variant="h6" component="div" sx={{ paddingLeft: 2 }}>
          {backdropMessage}
        </Typography>
      </Backdrop>
    </Layout>
  );
  
}