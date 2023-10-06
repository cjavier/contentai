import React, { useContext, useEffect, useState } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Title from './Title';
import { collection, getFirestore, getDocs, getDoc, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { CallOpenAIOutline, CallOpenAIContent } from './OpenAI'; 

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

  


  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }
  
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
      } catch (error) {
        console.error('Error al cargar los KeywordPlans:', error);
      }
    };
  
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
      const db = getFirestore();
  
      // 1. Obtener el título, la keyword, el outline y el buyerpersonaid
      const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);
      const keyword = keywordPlan.keywords.find(k => k.id === keywordId);
      const titleObj = keyword.titles.find(t => t.id === titleId);
      const buyerPersonaId = keywordPlan.buyerpersonaid;
  
      // 2. Obtener el buyerpersona_prompt y el content_prompt usando el buyerPersonaId
      const buyerPersonaDoc = await getDoc(doc(db, 'buyerpersonas', buyerPersonaId)); // Asumiendo que la colección se llama 'buyerPersonas'
      const buyerpersona_prompt = buyerPersonaDoc.data().buyerpersona_prompt;
      const content_prompt = buyerPersonaDoc.data().content_prompt;
  
      // 3. Llamar a la función CallOpenAIContent con el título, la keyword, el outline, el buyerpersona_prompt y el content_prompt
      const content = await CallOpenAIContent(titleObj.title, keyword.keyword, titleObj.outline, buyerpersona_prompt, content_prompt, currentUser.uid);
  
      // 4. Recibir el contenido y guardarlo en la propiedad content del título correspondiente en Firestore
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
      await updateDoc(titleRef, {
        content: content
      });
  
      console.log('Contenido creado exitosamente.');
  
      // Actualizar el estado local para reflejar el cambio
      setKeywordPlans(prevKeywordPlans => {
        return prevKeywordPlans.map(kp => {
          if (kp.id === keywordPlanId) {
            kp.keywords = kp.keywords.map(k => {
              if (k.id === keywordId) {
                k.titles = k.titles.map(t => {
                  if (t.id === titleId) {
                    t.content = content;
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
    let completed = 0;
    const total = keywordPlan.keywords.reduce((acc, keyword) => acc + keyword.titles.length, 0);
    setTotalOutlines(total);

    for (const keyword of keywordPlan.keywords) {
      for (const title of keyword.titles) {
        if (title.outline && (!title.content)) {
          await handleContentCreation(keywordPlanId, keyword.id, title.id);
          completed++;
          setCompletedOutlines(completed);
          setBackdropMessage(`Creando Contenido ${completed} de ${total}`);
        }
      }
    }

    console.log('Contenidos creados exitosamente para todos los títulos que lo requerían.');
  } catch (error) {
    console.error('Error al crear contenidos para todos los títulos:', error);
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
  
  

  return (
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
                        {title.outline ? (
                          <IconButton color="success">
                            <DoneIcon />
                          </IconButton>
                        ) : (
                          <IconButton color="primary" onClick={() => handleOutlineCreation(keywordPlan.id, keyword.id, title.id)}>
                            <AddIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                        {title.content ? (
                          <IconButton color="success">
                            <DoneIcon />
                          </IconButton>
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
  );
}
