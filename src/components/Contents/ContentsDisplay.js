import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Backdrop from '@mui/material/Backdrop';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import OutlineIcon from '@mui/icons-material/List'; 
import Modal from '@mui/material/Modal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; 
import Box from '@mui/material/Box';
import Title from '../Titles/Title';
import { collection, getFirestore, getDocs, getDoc, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../../AuthContext';
import { CallOpenAIOutline, CallOpenAIContent } from '../OpenAI'; 
import Layout from '../Layout/Layout';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { handleOutlineCreation as handleOutlineCreationHandler } from '../Handlers';
import { handleContentCreation as handleContentCreationHandler } from '../Handlers';
import { handleAllContentsCreation as handleAllContentsCreationHandler } from '../Handlers';
import { handleAllOutlinesDelete as handleAllOutlinesDeleteHandler } from '../Handlers';
import ConfirmationModal from './ConfirmationModal';


export default function ContentsDisplay() {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [editedTitle, setEditedTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const [completedOutlines, setCompletedOutlines] = useState(0);
  const [totalOutlines, setTotalOutlines] = useState(0);
  const navigate = useNavigate();
  const [cachedKeywordPlans, setCachedKeywordPlans] = useState(null);
  const { keywordPlanId } = useParams(); 
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
const [actionToConfirm, setActionToConfirm] = useState(null);
const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const loadKeywordPlans = async () => {
    if (!currentUser || !keywordPlanId) {
      console.error('Usuario no autenticado o keywordPlanId no proporcionado. No se pueden cargar los KeywordPlans.');
      return;
    }

    try {
      if (cachedKeywordPlans) {
        setKeywordPlans(cachedKeywordPlans);
        return;
      }
      const db = getFirestore();
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      const keywordPlanDoc = await getDoc(keywordPlanRef);

      if (!keywordPlanDoc.exists()) {
        console.error('El KeywordPlan no existe');
        return;
      }

      const keywordsSnapshot = await getDocs(collection(keywordPlanRef, 'keywords'));
      const keywords = [];
      for (const keywordDoc of keywordsSnapshot.docs) {
        const keywordData = {
          id: keywordDoc.id,
          ...keywordDoc.data()
        };

        const titlesSnapshot = await getDocs(collection(keywordDoc.ref, 'titles'));
        keywordData.titles = titlesSnapshot.docs.map(titleDoc => ({
          id: titleDoc.id,
          ...titleDoc.data()
        }));

        keywords.push(keywordData);
      }

      const keywordPlan = {
        id: keywordPlanDoc.id,
        ...keywordPlanDoc.data(),
        keywords
      };

      setCachedKeywordPlans([keywordPlan]);
      setKeywordPlans([keywordPlan]);
    } catch (error) {
      console.error('Error al cargar el KeywordPlan:', error);
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

  
  const handleOutlineCreation = async (keywordPlanId, keywordId, titleId) => {
    try {
      const userId = currentUser.uid; // Assuming currentUser has the uid property
      const response = await fetch(`http://localhost:8080/createalloutline?keywordPlanId=${keywordPlanId}&userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
        // Additional headers or configurations, if needed
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log('Outline created successfully');
      // Optionally, update your state or UI based on the response
    } catch (error) {
      console.error('Error creating outline:', error);
      // Handle error, update UI accordingly
    }
  };
  
  
  const handleContentCreation = async (keywordPlanId, keywordId, titleId) => {
    await handleContentCreationHandler(keywordPlanId, keywordId, titleId, currentUser);
  };

  const handleAllContentsCreation = async (keywordPlanId) => {
    try {
      setIsLoading(true);
      setBackdropMessage('Marcando la creación de todos los Contenidos...');
  
      const db = getFirestore();
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      await updateDoc(keywordPlanRef, {
        All_Content_Creation: true
      });
  
      console.log('All_Content_Creation marcado como True');
      setIsLoading(false);
      setBackdropMessage('');
    } catch (error) {
      console.error('Error al marcar All_Content_Creation:', error);
      setIsLoading(false);
      setBackdropMessage('Error al marcar All_Content_Creation');
    }
  };
  
  const handleAllOutlinesCreation = async (keywordPlanId) => {
    try {
      setIsLoading(true);
      setBackdropMessage('Marcando la creación de todos los Outlines...');
  
      const db = getFirestore();
      const keywordPlanRef = doc(db, 'keywordsplans', keywordPlanId);
      await updateDoc(keywordPlanRef, {
        All_Outline_Creation: true
      });
  
      console.log('All_Outline_Creation marcado como True');
      setIsLoading(false);
      setBackdropMessage('');
    } catch (error) {
      console.error('Error al marcar All_Outline_Creation:', error);
      setIsLoading(false);
      setBackdropMessage('Error al marcar All_Outline_Creation');
    }
  };

const handleAllOutlinesDelete = async (keywordPlanId) => {
  try {
    setIsLoading(true);
    setBackdropMessage('Borrando todos los Outlines...');

    const result = await handleAllOutlinesDeleteHandler(keywordPlanId, keywordPlans);

    if (result.status === 'ok') {
      setBackdropMessage('Tus outlines han sido borrados exitosamente');
      setTimeout(() => {
        setBackdropMessage('');
        setIsLoading(false);
      }, 5000);
    } else {
      setBackdropMessage(result.message);
      setIsLoading(false);
    }
  } catch (error) {
    console.error('Error al borrar todos los outlines:', error);
    setBackdropMessage('Error al borrar los outlines');
    setIsLoading(false);
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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [modalProps, setModalProps] = useState({
    open: false,
    title: '',
    description: '',
    onConfirm: null,
  });

  const handleOpenModal = (title, description, onConfirm) => {
    setModalProps({
      open: true,
      title,
      description,
      onConfirm,
    });
  };

  const handleCloseModal = () => {
    setModalProps({ ...modalProps, open: false });
  };
  
  
  const handleConfirmAction = () => {
    if (typeof modalProps.onConfirm === 'function') {
      modalProps.onConfirm(); // La función se ejecutará aquí después de la confirmación
      handleCloseModal(); // Cierra el modal después de confirmar
    } else {
      console.error('onConfirm is not a function', modalProps.onConfirm);
    }
  };
  
  return (
    <Layout>
    <Grid item xs={12}>
      {keywordPlans.map((keywordPlan) => (
        <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Plan de Contenido: {keywordPlan.id}</Title>
            <Button onClick={() => handleAllOutlinesCreation(keywordPlan.id)}>Crear todos los Outlines</Button>
            <Button onClick={() => handleAllContentsCreation(keywordPlan.id)}>Crear todos los Contenidos</Button>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Keyword</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Outline</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Contenido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keywordPlan.keywords.map((keyword) => 
                  keyword.titles.map((title, index) => (
                    <TableRow key={index}>
                      <TableCell style={wrapTextStyle}>
                        {title.title}
                      </TableCell>
                      <TableCell>{keyword.keyword}</TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                      { (title.outline && title.outline !== "") ? (
                          <Link to={`/outline/${keywordPlan.id}/${keyword.id}/${title.id}`} target="_blank">
                            <IconButton color="success">
                              <DoneIcon />
                            </IconButton>
                          </Link>
                        ) : (
                          <IconButton color="primary" onClick={() => handleOutlineCreation(keywordPlan.id, keyword.id, title.id)}>
                            <AddIcon />
                          </IconButton>
                        )}
                      </TableCell>   
                      <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                        {title.contentId ? (
                          <Link to={`/contenidos/${title.contentId}`} target="_blank">
                            <IconButton color="success">
                              <DoneIcon />
                            </IconButton>
                          </Link>
                        ) : (
                          <IconButton color="primary" onClick={() => handleContentCreation(keywordPlan.id, keyword.id, title.id)}>
                            <AddIcon />
                          </IconButton>
                        )}
                      </TableCell>   
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction 
            label="Crear Outlines" 
            icon={<OutlineIcon />} 
            onClick={() => handleOpenModal('Confirmación', 'Estás a punto de generar gran cantidad de contenidos. Este proceso puede demorar varias horas y costar dinero. ¿Estás seguro de que deseas continuar?', () => handleAllOutlinesCreation(keywordPlan.id))}
            />
          <BottomNavigationAction 
            label="Borrar todos los Outlines" 
            icon={<ContentCopyIcon />} 
            onClick={() => handleOpenModal('Confirmación de Eliminación', 'Vas a borrar todos tus outlines, ¿deseas continuar?', () => handleAllOutlinesDelete(keywordPlan.id))}
            />
          <BottomNavigationAction 
            label="Crear Contenidos" 
            icon={<ContentCopyIcon />} 
            onClick={() => handleOpenModal('Confirmación', 'Estás a punto de generar gran cantidad de contenidos. Este proceso puede demorar varias horas y costar dinero. ¿Estás seguro de que deseas continuar?', () => handleAllContentsCreation(keywordPlan.id))}
            />
        </BottomNavigation>
          </Paper>
        </Grid>
      ))}
      <Backdrop
  open={isLoading}
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
>
  <CircularProgressWithLabel value={(completedOutlines / totalOutlines) * 100} />
  <Typography variant="h6" component="div" sx={{ paddingLeft: 2 }}>
    {backdropMessage}
  </Typography>
</Backdrop>
    </Grid>
    <ConfirmationModal
      open={modalProps.open}
      title={modalProps.title}
      description={modalProps.description}
      onConfirm={handleConfirmAction}
      onClose={handleCloseModal}
    />
    </Layout>
    
  );
}
