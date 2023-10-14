import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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


  const loadKeywordPlans = async () => {
    try {
      const db = getFirestore();

      // Obtener la colección de KeywordPlans desde Firestore
      const keywordPlansCollection = collection(db, 'keywordsplans');

      // Consultar los documentos de KeywordPlans asociados al usuario actual
      const q = query(keywordPlansCollection, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      const keywordPlansData = [];

      for (const keywordPlanDoc of querySnapshot.docs) {
        const keywordsSnapshot = await getDocs(collection(keywordPlanDoc.ref, 'keywords'));
        
        const keywords = [];
        for (const keywordDoc of keywordsSnapshot.docs) {
          const keywordData = {
            id: keywordDoc.id,
            ...keywordDoc.data()
          };
  
          // Recuperar los títulos para esta keyword
          const titlesSnapshot = await getDocs(collection(keywordDoc.ref, 'titles'));
          keywordData.titles = titlesSnapshot.docs.map(titleDoc => ({
            id: titleDoc.id,
            ...titleDoc.data() // Aquí obtenemos todas las propiedades del título, incluyendo 'outline' y 'content'
          }));
  
          keywords.push(keywordData);
        }
      
        const keywordPlan = {
          id: keywordPlanDoc.id,
          ...keywordPlanDoc.data(),
          keywords
        };
      
        keywordPlansData.push(keywordPlan);
      }
  
      setKeywordPlans(keywordPlansData);
      setCachedKeywordPlans(keywordPlansData); 
    } catch (error) {
      console.error('Error al cargar los KeywordPlans:', error);
    }
  };


  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }
    if (cachedKeywordPlans) {
      setKeywordPlans(cachedKeywordPlans);
    } else {
      loadKeywordPlans();
    }
    
  
  
  
    loadKeywordPlans();
  }, [currentUser]);

  
  const handleContentPublishing = async (keywordPlanId, keywordId, titleId) => {
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
        const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
        const titleDoc = await getDoc(titleRef);
        const titleData = titleDoc.data();
        const title = titleData.title;
        const content = titleData.content;

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
        await updateDoc(titleRef, {
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

      // Obtener la colección de KeywordPlans desde Firestore
      const keywordPlansCollection = collection(db, 'keywordsplans');

      // Consultar los documentos de KeywordPlans asociados al usuario actual
      const q = query(keywordPlansCollection, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);

      let totalTitlesToPublish = 0;
      let publishedCount = 0;

      // Primero, calcular el total de títulos a publicar
      for (const keywordPlanDoc of querySnapshot.docs) {
          const keywordsSnapshot = await getDocs(collection(keywordPlanDoc.ref, 'keywords'));
          for (const keywordDoc of keywordsSnapshot.docs) {
              const titlesSnapshot = await getDocs(collection(keywordDoc.ref, 'titles'));
              titlesSnapshot.docs.forEach(titleDoc => {
                  const title = titleDoc.data();
                  if (!title.published) {
                      totalTitlesToPublish++;
                  }
              });
          }
      }

      // Establecer el total de títulos a publicar
      setTotalContents(totalTitlesToPublish);

      // Luego, recorrer y publicar títulos
      for (const keywordPlanDoc of querySnapshot.docs) {
          const keywordsSnapshot = await getDocs(collection(keywordPlanDoc.ref, 'keywords'));
          for (const keywordDoc of keywordsSnapshot.docs) {
              const titlesSnapshot = await getDocs(collection(keywordDoc.ref, 'titles'));
              for (const titleDoc of titlesSnapshot.docs) {
                  const title = titleDoc.data();
                  if (!title.published) {
                      await handleContentPublishing(keywordPlanDoc.id, keywordDoc.id, titleDoc.id);
                      publishedCount++;
                      setPublishedContents(publishedCount);
                  }
              }
          }
      }

      setIsLoading(false);
      console.log('Todos los contenidos han sido publicados con éxito.');

  } catch (error) {
      setIsLoading(false);
      console.error('Error al publicar todos los contenidos:', error);
  }
};



  


  const handleContentDeletion = async (keywordPlanId, keywordId, titleId) => {
    try {
        const db = getFirestore();
        // Referencia al documento que deseas eliminar
        const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
        
        // Actualizar el documento y eliminar la propiedad 'content'
        await updateDoc(titleRef, {
          content: deleteField()
        });
        
        // Recargar los planes de palabras clave para reflejar los cambios en la UI
        loadKeywordPlans();
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
    <Grid item xs={12}>
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Plan de Contenido: {keywordPlan.id}</Title>
            <Button onClick={() => handleAllContentsPublishing(keywordPlan.id)}>Publicar todos los contenidos</Button>
            <Table size="small">
            <TableHead>
    <TableRow>
        <TableCell>Title</TableCell>
        <TableCell>Número de palabras</TableCell>
        <TableCell>Publicar</TableCell>
        <TableCell>Eliminar</TableCell> {/* Nueva columna */}
    </TableRow>
</TableHead>
<TableBody>
    {keywordPlan.keywords.map((keyword) => 
        keyword.titles.map((title, index) => (
            <TableRow key={index}>
                <TableCell>{title.title}</TableCell>
                <TableCell>{countWordsInHtml(title.content)}</TableCell>
                <TableCell>
                    {title.published ? (
                        <IconButton color="success">
                            <DoneIcon />
                        </IconButton>
                    ) : (
                        <IconButton color="primary" onClick={() => handleContentPublishing(keywordPlan.id, keyword.id, title.id)}>
                            <PublishIcon />
                        </IconButton>
                    )}
                </TableCell>
                <TableCell>
                    <IconButton color="error" onClick={() => handleContentDeletion(keywordPlan.id, keyword.id, title.id)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell> {/* Botón de borrar */}
            </TableRow>
        ))
    )}
</TableBody>
            </Table>
          </Paper>
        </Grid>
      ))}
      <Backdrop
        open={isLoading}
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
        <CircularProgressWithLabel value={(publishedContents / totalContents) * 100} />
        <Typography variant="h6" component="div" sx={{ paddingLeft: 2 }}>
          {backdropMessage}
        </Typography>
    </Backdrop>
    </Grid>
  );
}