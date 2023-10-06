import React, { useContext, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { collection, getFirestore, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';

export default function TitlesDisplay() {
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');


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
              title: titleDoc.data().title
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

  const handleDeleteTitle = async (keywordPlanId, keywordId, titleId) => {
    try {
      const db = getFirestore();
  
      // Obtener una referencia al documento del título que deseas eliminar
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
  
      // Eliminar el documento del título
      await deleteDoc(titleRef);
  
      console.log('Título eliminado exitosamente.');
  
      // Actualizar el estado eliminando el título del keyword correspondiente
      setKeywordPlans((prevKeywordPlans) =>
        prevKeywordPlans.map((keywordPlan) => 
          keywordPlan.id === keywordPlanId 
            ? { 
                ...keywordPlan, 
                keywords: keywordPlan.keywords.map(keyword => 
                  keyword.id === keywordId
                    ? { ...keyword, titles: keyword.titles.filter(title => title.id !== titleId) }
                    : keyword
                )
              }
            : keywordPlan
        )
      );
    } catch (error) {
      console.error('Error al eliminar el título:', error);
    }
  };
  

  const startEditing = (titleId, currentTitle) => {
    setEditingTitleId(titleId);
    setEditedTitle(currentTitle);
  };
  
  const handleEditTitle = async (keywordPlanId, keywordId, titleId) => {
    try {
      const db = getFirestore();
  
      // Actualizar el título en Firebase
      const titleRef = doc(db, 'keywordsplans', keywordPlanId, 'keywords', keywordId, 'titles', titleId);
      await updateDoc(titleRef, { title: editedTitle });
  
      // Actualizar el estado local
      setKeywordPlans((prevKeywordPlans) =>
        prevKeywordPlans.map((keywordPlan) => 
          keywordPlan.id === keywordPlanId 
            ? { 
                ...keywordPlan, 
                keywords: keywordPlan.keywords.map(keyword => 
                  keyword.id === keywordId
                    ? { 
                        ...keyword, 
                        titles: keyword.titles.map(title => 
                          title.id === titleId
                            ? { ...title, title: editedTitle }
                            : title
                        )
                      }
                    : keyword
                )
              }
            : keywordPlan
        )
      );
  
      // Salir del modo de edición
      setEditingTitleId(null);
      setEditedTitle('');
  
    } catch (error) {
      console.error('Error al editar el título:', error);
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
            <Title>Keyword Plan: {keywordPlan.id}</Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Keyword</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Edit</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {keywordPlan.keywords.map((keyword) => 
                  keyword.titles.map((title, index) => (
                    <TableRow key={index}>
                      <TableCell style={wrapTextStyle}>
                        {editingTitleId === title.id ? (
                          <input 
                            value={editedTitle} 
                            onChange={(e) => setEditedTitle(e.target.value)} 
                            style={inputStyle}
                          />
                        ) : (
                          title.title
                        )}
                      </TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'right' }}>{keyword.keyword}</TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                        {editingTitleId === title.id ? (
                          <Button onClick={() => handleEditTitle(keywordPlan.id, keyword.id, title.id)}>Guardar</Button>
                        ) : (
                          <IconButton color="primary" onClick={() => startEditing(title.id, title.title)}>
                            <EditIcon />
                          </IconButton>
                                )}
                      </TableCell>
                      <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDeleteTitle(keywordPlan.id, keyword.id, title.id)}
                      >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
