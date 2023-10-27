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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Title from './Title';
import { collection, getFirestore, getDocs, getDoc, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { CallOpenAIOutline, CallOpenAIContent } from './OpenAI'; 
import Layout from './Layout';


function CircularProgressWithLabel(props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
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
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}


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
      const db = getFirestore();
  
      // 1. Obtener la keyword, el título y el buyerpersonaid
      const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);
      const keyword = keywordPlan.keywords.find(k => k.id === keywordId);
      const titleObj = keyword.titles.find(t => t.id === titleId);
      const buyerPersonaId = keywordPlan.buyerpersonaid;
  
      // 2. Obtener el buyerpersona_prompt usando el buyerPersonaId
      const buyerPersonaDoc = await getDoc(doc(db, 'buyerpersonas', buyerPersonaId)); // Asumiendo que la colección se llama 'buyerPersonas'
      const buyerpersona_prompt = buyerPersonaDoc.data().buyerpersona_prompt;
  
      // 3. Llamar a la función CallOpenAIOutline con el título, la keyword y el buyerpersona_prompt
      const outline = await CallOpenAIOutline(titleObj.title, keyword.keyword, buyerpersona_prompt, currentUser.uid);
  
      // 4. Recibir el outline y guardarlo en la propiedad outline del título correspondiente en Firestore
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
      await updateDoc(titleRef, {
        outline: outline
      });
  
      console.log('Outline creado exitosamente.');
  
      // Actualizar el estado local para reflejar el cambio
      setKeywordPlans(prevKeywordPlans => {
        return prevKeywordPlans.map(kp => {
          if (kp.id === keywordPlanId) {
            kp.keywords = kp.keywords.map(k => {
              if (k.id === keywordId) {
                k.titles = k.titles.map(t => {
                  if (t.id === titleId) {
                    t.outline = outline;
                  }
                  return t;
                });
              }
              return k;
            });
          }
          return kp;
        });
      });
  
    } catch (error) {
      console.error('Error al crear el outline:', error);
    }
  };
  


  const handleContentCreation = async (keywordPlanId, keywordId, titleId) => {
    try {
      const userId = currentUser.uid; // Asegúrate de que currentUser y uid estén definidos correctamente
  
      // 1. Realizar la solicitud al servidor
      const response = await fetch(`http://localhost:8080/createcontent?userId=${userId}&keywordPlanId=${keywordPlanId}&keywordId=${keywordId}&titleId=${titleId}`, {
        method: 'POST',
      });
  
      // 2. Verificar si la solicitud fue exitosa
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} - ${response.statusText}`);
      }
  
      // 3. Leer la respuesta del servidor
      const result = await response.text();
      console.log(result);
  
    } catch (error) {
      console.error('Error al crear el contenido:', error);
    }
  };
  

const handleAllOutlinesCreation = async (keywordPlanId) => {
  try {
    setIsLoading(true);
    setBackdropMessage('Creando todos los Outlines...');

    const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);
    let completed = 0;
    const total = keywordPlan.keywords.reduce((acc, keyword) => acc + keyword.titles.length, 0);
    setTotalOutlines(total);

    for (const keyword of keywordPlan.keywords) {
      for (const title of keyword.titles) {
        if (!title.outline) {
          await handleOutlineCreation(keywordPlanId, keyword.id, title.id);
          completed++;
          setCompletedOutlines(completed);
          setBackdropMessage(`Creando Outline ${completed} de ${total}`);
        }
      }
    }

    console.log('Outlines creados exitosamente para todos los títulos que lo requerían.');
  } catch (error) {
    console.error('Error al crear outlines para todos los títulos:', error);
  } finally {
    setIsLoading(false);
    setBackdropMessage('');
  }
};


const handleAllContentsCreation = async (keywordPlanId) => {
  try {
    setIsLoading(true);
    setBackdropMessage('Creando todos los Contenidos...');

    const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);
    const total = keywordPlan.keywords.reduce((acc, keyword) => acc + keyword.titles.length, 0);
    setTotalOutlines(total);

    // Hacer la llamada al servidor para crear todos los contenidos
    const response = await fetch(`http://localhost:8080/createallcontent?userId=${currentUser.uid}&keywordPlanId=${keywordPlanId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al crear contenidos en el servidor');
    }

    console.log('Contenidos en proceso de creación.');
    setBackdropMessage('Contenidos creados exitosamente');
  } catch (error) {
    console.error('Error al crear contenidos para todos los títulos:', error);
    setBackdropMessage('Error al crear contenidos');
  } finally {
    setIsLoading(false);
    setBackdropMessage('');
  }
};



const handleAllOutlinesDelete = async (keywordPlanId) => {
  try {
    setIsLoading(true);
    setBackdropMessage('Borrando todos los Outlines...');

    const db = getFirestore();
    const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);
    let completed = 0;
    const total = keywordPlan.keywords.reduce((acc, keyword) => acc + keyword.titles.length, 0);
    setTotalOutlines(total);

    for (const keyword of keywordPlan.keywords) {
      for (const title of keyword.titles) {
        if (title.outline) {  // Verifica si el título tiene un outline
          const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keyword.id, 'titles', title.id);
          await updateDoc(titleRef, {
            outline: ''  // Establece la propiedad outline a una cadena vacía
          });
          completed++;
          setCompletedOutlines(completed);
          setBackdropMessage(`Borrando Outline ${completed} de ${total}`);
        }
      }
    }

    console.log('Outlines borrados exitosamente para todos los títulos que lo requerían.');
  } catch (error) {
    console.error('Error al borrar todos los outlines:', error);
  } finally {
    setIsLoading(false);
    setBackdropMessage('');
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

  const handleOpenCreateModal = (action) => {
    setActionToConfirm(() => action); // Cambia esta línea
    setOpenModal(true);
  };

  const handleOpenDeleteModal = (action) => {
    setActionToConfirm(() => action);  // Setea la acción a confirmar
    setOpenDeleteModal(true);  // Abre el modal de eliminar
  };
  
  
  const handleConfirmAction = () => {
    if (typeof actionToConfirm === 'function') {
      actionToConfirm(); // La función se ejecutará aquí después de la confirmación
      handleCloseModal();
    } else {
      console.error('actionToConfirm is not a function', actionToConfirm);
    }
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
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
            onClick={() => handleOpenCreateModal(() => handleAllOutlinesCreation(keywordPlan.id))} // Cambia esta línea
          />
          <BottomNavigationAction 
            label="Borrar todos los Outlines" 
            icon={<ContentCopyIcon />} 
            onClick={() => handleOpenDeleteModal(() => handleAllOutlinesDelete(keywordPlan.id))} // Cambia esta línea
          />
          <BottomNavigationAction 
            label="Crear Contenidos" 
            icon={<ContentCopyIcon />} 
            onClick={() => handleOpenCreateModal(() => handleAllContentsCreation(keywordPlan.id))} // Y esta línea
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
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Confirmación
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Estás a punto de generar gran cantidad de contenidos. Este proceso puede demorar varias horas y costar dinero. ¿Estás seguro de que deseas continuar?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button sx={{ mr: 2 }} onClick={handleCloseModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmAction}>Confirmar</Button>
        </Box>
      </Box>
    </Modal>
    <Modal
      open={openDeleteModal}
      onClose={() => setOpenDeleteModal(false)}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box sx={style}>
        <Typography id="delete-modal-title" variant="h6" component="h2">
          Confirmación de Eliminación
        </Typography>
        <Typography id="delete-modal-description" sx={{ mt: 2 }}>
          Vas a borrar todos tus outlines, ¿deseas continuar?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button sx={{ mr: 2 }} onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleConfirmAction}>Confirmar</Button>
        </Box>
      </Box>
    </Modal>

    </Layout>
    
  );
}
