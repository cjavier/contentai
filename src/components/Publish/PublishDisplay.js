import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
import Title from '../Titles/Title';
import { collection, getFirestore, getDocs, getDoc, query, where, doc, deleteDoc, updateDoc, FieldValue, deleteField } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';
import axios from 'axios';
import Layout from '../Layout/Layout';
import CategorySelectModal from './CategorySelectModal';



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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  const handleCategorySelect = async (category) => {
    setShowCategoryModal(false);
    setSelectedCategory(category);
    if (category) {
      contents.forEach(async (content) => {
        await axios.put(`${backendUrl}/contents/${content.id}`, { category });
      });
      console.log(`Categoría '${category}' agregada a todos los contenidos.`);
    }
  };

  const loadContents = async () => {
    if (!currentUser || !keywordPlanId) {
      console.error('Usuario no autenticado o keywordPlanId no proporcionado. No se pueden cargar los contenidos.');
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/contents/keywordplan/${keywordPlanId}`);
      setContents(response.data.contents);
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
      console.log(`Iniciando publicación de contenido con ID: ${contentId}`);

      // Obtener los datos del negocio desde el backend
      const businessResponse = await axios.get(`${backendUrl}/business/${currentUser.uid}`);
      const businessData = businessResponse.data.business;
      console.log('Datos de negocio:', businessData);
  
      // Verificar si los datos de WordPress existen
      if (!businessData.wpWebsiteUrl || !businessData.wpUsername || !businessData.wpAppPassword) {
        console.error('Datos de WordPress no configurados.');
        return;
      }
  
      // Obtener el título y el contenido desde el backend
      const contentResponse = await axios.get(`${backendUrl}/contents/${contentId}`);
      const contentData = contentResponse.data.content;
      console.log('Datos del contenido:', contentData);
  
      const title = contentData.contenttitle;
      const content = contentData.content;
      const categoryId = contentData.category;
  
      // Configuración para la API de WordPress
      const url = `${businessData.wpWebsiteUrl}wp-json/wp/v2/posts`;
      const username = businessData.wpUsername;
      const password = businessData.wpAppPassword;
  
      const headers = {
        Authorization: 'Basic ' + btoa(username + ':' + password),
        'Content-Type': 'application/json',
      };
  
      const data = {
        title: title,
        content: content,
        status: 'publish',
        categories: [categoryId],
      };
  
      console.log('Datos para la API de WordPress:', data);
  
      // Publicar el contenido en WordPress
      const response = await axios.post(url, data, { headers: headers });
      const postUrl = response.data.link;
      console.log(`Contenido publicado con éxito en: ${postUrl}`);
  
      // Guardar la URL publicada en el backend
      await axios.put(`${backendUrl}/contents/${contentId}`, { published: postUrl });
      console.log(`URL del post guardada con éxito en el backend: ${postUrl}`);
  
    } catch (error) {
      console.error('Error al publicar el contenido:', error);
    }
  };
  
  const handleAllContentsPublishing = async () => {
    try {
      setIsLoading(true);
      setBackdropMessage('Publicando contenidos...');
      setPublishedContents(0);
      setTotalContents(contents.length);
  
      for (const content of contents) {
        // Solo procesar aquellos contenidos que no tienen una URL publicada
        if (!content.published) {
          await handleContentPublishing(content.id);
          setPublishedContents((prev) => prev + 1);
        }
      }
  
      setIsLoading(false);
      setBackdropMessage('Todos los contenidos no publicados han sido publicados con éxito.');
    } catch (error) {
      console.error('Error al publicar los contenidos:', error);
      setIsLoading(false);
    }
  };


  const handleContentDeletion = async (contentId) => {
    try {
      await axios.delete(`${backendUrl}/contents/${contentId}`);
      setContents(contents.filter(content => content.id !== contentId));
    } catch (error) {
      console.error('Error al eliminar el contenido:', error);
    }
  };

const handleAllContentsCategory = async () => {
  setShowCategoryModal(true);
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
            <Button onClick={() => handleAllContentsCategory()}>Agregar Categoría a todos los contenidos</Button>
            <Button onClick={() => handleAllContentsPublishing()}>Publicar todos los contenidos</Button>
            <Table size="small">
  <TableHead>
    <TableRow>
      <TableCell>Title</TableCell>
      <TableCell>Número de palabras</TableCell>
      <TableCell>Categoría</TableCell>
      <TableCell>Publicado</TableCell> {/* Nueva columna para el link */}
      <TableCell>Publicar</TableCell>
      <TableCell>Eliminar</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {contents.map((content, index) => (
      <TableRow key={index}>
        <TableCell>
          <Link to={`/contenidos/${content.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {content.contenttitle}
          </Link>
        </TableCell>
        <TableCell>{countWordsInHtml(content.content)}</TableCell>
        <TableCell>{content.category}</TableCell>
        
        {/* Columna con el icono y enlace al contenido publicado */}
        <TableCell>
          {content.published ? (
            <IconButton
              component="a"
              href={content.published}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
            >
              <DoneIcon />
            </IconButton>
          ) : (
            <Typography variant="body2" color="textSecondary">No publicado</Typography>
          )}
        </TableCell>

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
      <CategorySelectModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onConfirm={handleCategorySelect}
        title="Seleccionar Categoría"
        description="Por favor, elige una categoría para los contenidos."
      />
    </Layout>
  );
  
}