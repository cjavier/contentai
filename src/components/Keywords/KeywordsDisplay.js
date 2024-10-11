import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import TextField from '@mui/material/TextField';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AddIcon from '@mui/icons-material/Add';
import TitleIcon from '@mui/icons-material/Title';
import Title from '../Titles/Title';
import Layout from '../Layout/Layout';
import { AuthContext } from '../../AuthContext';
import { CallOpenAITitle } from '../OpenAI';
import axios from 'axios'; // Import axios for HTTP requests

export default function KeywordsDisplay() {
  const { keywordPlanId } = useParams();
  const [keywordPlans, setKeywordPlans] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedKeywordPlan, setSelectedKeywordPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const [isAddKeywordModalVisible, setIsAddKeywordModalVisible] = useState(false);
  const [newKeywords, setNewKeywords] = useState('');
  const [editingKeywordId, setEditingKeywordId] = useState(null);
  const [editingKeywordValue, setEditingKeywordValue] = useState('');
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los KeywordPlans.');
      return;
    }

    const loadKeywordPlans = async () => {
      try {
        // Obtener el keyword plan específico y sus keywords
        const response = await axios.get(`${backendUrl}/keywordplans/${keywordPlanId}`);
        const keywordPlan = response.data.keywordPlan;

        setKeywordPlans([keywordPlan]); // Establecer el estado con un array que contiene solo este KeywordPlan
      } catch (error) {
        console.error('Error al cargar el KeywordPlan:', error);
      }
    };

    loadKeywordPlans();
  }, [currentUser, keywordPlanId]);

  const handleEditKeywordStart = (keywordId, keywordValue) => {
    setEditingKeywordId(keywordId);
    setEditingKeywordValue(keywordValue);
  };

  

  const handleOpenAddKeywordModal = (keywordPlanId) => {
    setSelectedKeywordPlan(keywordPlanId); // Actualiza el estado con el ID del KeywordPlan
    setIsAddKeywordModalVisible(true);
  };

  const handleCloseAddKeywordModal = () => {
    setIsAddKeywordModalVisible(false);
  };

  const handleAddKeywords = async () => {
    try {
      if (!currentUser) {
        console.error('Usuario no autenticado. No se pueden agregar keywords.');
        return;
      }

      if (!selectedKeywordPlan) {
        console.error('No se ha seleccionado un KeywordPlan.');
        return;
      }

      // Agregar keywords al KeywordPlan
      const keywordsArray = newKeywords.split('\n');
      await axios.post(`${backendUrl}/keywords`, {
        keywordPlanId: selectedKeywordPlan,
        keywords: keywordsArray,
      });

      console.log('Keywords agregadas exitosamente al KeywordPlan.');

      // Limpiar el estado de newKeywords y cerrar el modal
      setNewKeywords('');
      setIsAddKeywordModalVisible(false);

      // Actualizar el estado recargando los KeywordPlans
      const response = await axios.get(`${backendUrl}/keywordplans/${keywordPlanId}`);
      const keywordPlan = response.data.keywordPlan;
      setKeywordPlans([keywordPlan]);
    } catch (error) {
      console.error('Error al agregar keywords al KeywordPlan:', error);
    }
  };

  const handleDeleteKeywordPlan = async (keywordPlanId) => {
    try {
      // Eliminar el KeywordPlan
      await axios.delete(`${backendUrl}/keywordplans/${keywordPlanId}`);

      console.log('KeywordPlan eliminado exitosamente.');

      // Actualiza el estado eliminando el KeywordPlan
      setKeywordPlans((prevKeywordPlans) =>
        prevKeywordPlans.filter((keywordPlan) => keywordPlan.id !== keywordPlanId)
      );
    } catch (error) {
      console.error('Error al eliminar el KeywordPlan:', error);
    }
  };

  const handleDeleteKeyword = async (keywordPlanId, keywordId) => {
    try {
      if (!keywordPlanId || !keywordId) {
        console.error('Falta keywordPlanId o keywordId:', keywordPlanId, keywordId);
        return;
      }

      // Eliminar la keyword
      await axios.delete(`${backendUrl}/keywords/${keywordId}`);

      console.log('Keyword eliminada exitosamente.');

      // Actualizar el estado recargando los KeywordPlans
      const response = await axios.get(`${backendUrl}/keywordplans/${keywordPlanId}`);
      const keywordPlan = response.data.keywordPlan;
      setKeywordPlans([keywordPlan]);
    } catch (error) {
      console.error('Error al eliminar la keyword:', error);
    }
  };

  const handleTitleCreation = async (keywordPlanId) => {
    try {
      setIsLoading(true); // Mostrar el CircularProgress
      setBackdropMessage('Creando títulos...'); // Mensaje inicial

      const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);

      if (!keywordPlan || !keywordPlan.keywords) {
        setBackdropMessage('No se encontraron keywords.');
        setIsLoading(false);
        return;
      }

      for (let i = 0; i < keywordPlan.keywords.length; i++) {
        const keyword = keywordPlan.keywords[i];

        setBackdropMessage(`Creando títulos para la keyword "${keyword.keyword}" (${i + 1}/${keywordPlan.keywords.length})...`);

        const titleIdeas = await CallOpenAITitle(keyword.keyword, keywordPlan.titlePrompt, currentUser.uid);

        await axios.post(`${backendUrl}/titles`, {
          keywordId: keyword.id,
          keywordplanid: keywordPlanId,
          titles: titleIdeas
        });
      }

      setBackdropMessage('Títulos creados exitosamente.');
      setTimeout(() => {
        setIsLoading(false);
        setBackdropMessage('');
      }, 2000);

    } catch (error) {
      console.error('Error al crear títulos:', error);
      setBackdropMessage('Error al crear títulos');
      setTimeout(() => {
        setIsLoading(false);
        setBackdropMessage('');
      }, 2000);
    }
  };

  const handleSingleTitleCreation = async (keywordPlanId, keywordId) => {
    const keywordPlan = keywordPlans.find(kp => kp.id === keywordPlanId);
    const keyword = keywordPlan.keywords.find(k => k.id === keywordId);
    console.log(keyword);
    try {
      setIsLoading(true);
      setBackdropMessage('Creando los títulos para la keyword...'); // Optional: Show a backdrop message

      // Llamar a la función CallOpenAITitle para obtener las ideas de títulos
      const titleIdeas = await CallOpenAITitle(keyword.keyword, keywordPlan.titlePrompt, currentUser.uid);

      // Guardar cada título generado en el backend
      await axios.post(`${backendUrl}/titles`, {
        keywordId: keyword.id,
        keywordplanid: keywordPlanId,
        titles: titleIdeas
      });

      console.log('Títulos creados exitosamente.');
      setBackdropMessage('Títulos creados exitosamente');
      setTimeout(() => {
        setIsLoading(false);
        setBackdropMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error al crear títulos:', error);
      setIsLoading(false);
      setBackdropMessage('Error al crear títulos');
      setTimeout(() => {
        setBackdropMessage('');
      }, 2000);
    }
  };

  const handleSaveEditedKeyword = async (keywordPlanId, keywordId) => {
    try {
      // Actualizar la keyword en el backend
      await axios.put(`${backendUrl}/keywords/${keywordId}`,
        { keyword: editingKeywordValue });
        // Actualizar el estado local
  setKeywordPlans((prevKeywordPlans) =>
    prevKeywordPlans.map((keywordPlan) =>
      keywordPlan.id === keywordPlanId
        ? {
            ...keywordPlan,
            keywords: keywordPlan.keywords.map((keyword) =>
              keyword.id === keywordId
                ? { ...keyword, keyword: editingKeywordValue }
                : keyword
            ),
          }
        : keywordPlan
    )
  );

  // Resetear el estado de edición
  setEditingKeywordId(null);
  setEditingKeywordValue('');
} catch (error) {
  console.error('Error al actualizar la keyword:', error);
}
  };

  return (
    <Layout>
      <Grid item xs={12}>
        {/* Diálogo para agregar keywords */}
        <Dialog open={isAddKeywordModalVisible} onClose={handleCloseAddKeywordModal}>
          <DialogTitle>Agregar Keywords al Plan</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ingresa las keywords que deseas agregar:
            </DialogContentText>
            <TextField
              fullWidth
              sx={{ m: 1 }}
              multiline
              maxRows={8}
              value={newKeywords}
              onChange={(e) => setNewKeywords(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddKeywordModal} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleAddKeywords} color="primary">
              Agregar Keywords
            </Button>
          </DialogActions>
        </Dialog>
  
        {/* Lista de keywords */}
        {keywordPlans.map((keywordPlan) => (
          <Grid item xs={12} key={keywordPlan.id} sx={{ pb: 2 }}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <Title>Keyword Plan: {keywordPlan.planName}</Title>
              <Typography component="div" variant="subtitle1">
                Descripción: {keywordPlan.description}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Keyword</TableCell>
                    <TableCell sx={{ width: '15%', textAlign: 'right' }}>Crear Títulos</TableCell>
                    <TableCell sx={{ width: '15%', textAlign: 'right' }}>Edit</TableCell>
                    <TableCell sx={{ width: '15%', textAlign: 'right' }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {keywordPlan.keywords.map((keyword, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {editingKeywordId === keyword.id ? (
                          <TextField
                            value={editingKeywordValue}
                            onChange={(e) => setEditingKeywordValue(e.target.value)}
                          />
                        ) : (
                          keyword.keyword
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton
                          aria-label="create"
                          color="primary"
                          onClick={() => handleSingleTitleCreation(keywordPlan.id, keyword.id)}
                        >
                          <LightbulbIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        {editingKeywordId === keyword.id ? (
                          <IconButton
                            aria-label="save"
                            color="primary"
                            onClick={() => handleSaveEditedKeyword(keywordPlan.id, keyword.id)}
                          >
                            <SaveIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => handleEditKeywordStart(keyword.id, keyword.keyword)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => handleDeleteKeyword(keywordPlan.id, keyword.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <BottomNavigation showLabels>
                <BottomNavigationAction label="Agregar Keywords" icon={<AddIcon />} onClick={() => handleOpenAddKeywordModal(keywordPlan.id)} />
                <BottomNavigationAction label="Crear Ideas de Títulos" icon={<TitleIcon />} onClick={() => handleTitleCreation(keywordPlan.id)} />
                <BottomNavigationAction label="Borrar Keyword Plan" icon={<DeleteIcon />} onClick={() => handleDeleteKeywordPlan(keywordPlan.id)} />
              </BottomNavigation>
            </Paper>
          </Grid>
        ))}
        <Backdrop open={isLoading} style={{ zIndex: 9999, color: '#fff', flexDirection: 'column' }}>
          <CircularProgress color="inherit" />
          <Typography style={{ marginTop: 20 }}>{backdropMessage}</Typography>
        </Backdrop>
      </Grid>
    </Layout>
  ); 
}
