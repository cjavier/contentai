import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import Title from '../Titles/Title';
import { AuthContext } from '../../AuthContext';
import Layout from '../Layout/Layout';
import axios from 'axios';

export default function ContentsDisplay() {
  const [titles, setTitles] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [backdropMessage, setBackdropMessage] = useState('');
  const { keywordPlanId } = useParams();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Function to load titles for a specific keyword plan
  const loadTitles = async () => {
    if (!currentUser || !keywordPlanId) {
      console.error('Usuario no autenticado o keywordPlanId no proporcionado. No se pueden cargar los Títulos.');
      return;
    }

    try {
      // Fetch titles for the given keyword plan
      const response = await axios.get(`${backendUrl}/keywordplans/${keywordPlanId}/titles`);
      const titlesData = response.data.titles;

      // Sort titles so that those with content or outline come first
      titlesData.sort((a, b) => {
        if ((a.contentid || a.outline) && !(b.contentid || b.outline)) {
          return -1;
        }
        if (!(a.contentid || a.outline) && (b.contentid || b.outline)) {
          return 1;
        }
        return 0;
      });

      setTitles(titlesData); // Update state with the fetched titles
    } catch (error) {
      console.error('Error al cargar los títulos:', error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los Títulos.');
      return;
    }
    loadTitles(); // Load titles on component mount
  }, [currentUser]);

  // Function to handle outline creation
  const handleOutlineCreation = async (keywordPlanId, keywordId, titleId) => {
    console.log('handleOutlineCreation', keywordPlanId, keywordId, titleId);
    try {
      const response = await fetch(`${backendUrl}/openai/create-outline`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
              keywordPlanId: Number(keywordPlanId), 
              keywordId: Number(keywordId), 
              titleId: Number(titleId) 
          }),
      });

        if (response.ok) {
            const result = await response.json();
            console.log('Outline created successfully', result);
            loadTitles(); // Reload to update outlines
        } else {
            console.error('Failed to create outline:', response.statusText);
        }
    } catch (error) {
        console.error('Error creating outline:', error);
    }
};

  // Function to handle content creation
  const handleContentCreation = async (keywordPlanId, keywordId, titleId) => {
    try {
      setIsLoading(true);
      setBackdropMessage('Creando contenido en segundo plano...');

      const response = await axios.post(`${backendUrl}/openai/create-content`, {
        userId: currentUser.uid,
        keywordPlanId: Number(keywordPlanId),
        keywordId: Number(keywordId),
        titleId: Number(titleId),
      });

      if (response.status === 200) {
        console.log('Datos recibidos correctamente. El contenido se está procesando en segundo plano.');
        setBackdropMessage('El contenido se está creando en segundo plano. Por favor, espera un momento.');
        // Aquí podrías establecer un temporizador o un polling para verificar si el contenido ha sido creado
      } else {
        console.error('Error inesperado al crear contenido:', response.statusText);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error creando contenido:', error);
      setBackdropMessage('Error al intentar crear el contenido.');
      setIsLoading(false);
    }
  };

  // Function to handle all content creation for a keyword plan
  const handleAllContentsCreation = async (keywordPlanId) => {
    try {
      setIsLoading(true);
      setBackdropMessage('Marcando la creación de todos los Contenidos...');

      await axios.put(`${backendUrl}/keywordplans/${keywordPlanId}`, {
        allcontentcreation: true,
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

  // Function to handle all outline creation for a keyword plan
  const handleAllOutlinesCreation = async (keywordPlanId) => {
    try {
      setIsLoading(true);
      setBackdropMessage('Marcando la creación de todos los Outlines...');

      await axios.put(`${backendUrl}/keywordplans/${keywordPlanId}`, {
        alloutlinecreation: true,
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

  const wrapTextStyle = {
    maxWidth: '150px', // You can adjust this value as needed
    whiteSpace: 'normal',
    maxHeight: '60px', // Adjust according to your needs
    overflow: 'auto',  // Adds scrollbars if content exceeds maxHeight
  };

  return (
    <Layout>
      <Grid item xs={12}>
        <Grid item xs={12} sx={{ pb: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Plan de Contenido ID: {keywordPlanId}</Title>
            <Button onClick={() => handleAllOutlinesCreation(keywordPlanId)}>Crear todos los Outlines</Button>
            <Button onClick={() => handleAllContentsCreation(keywordPlanId)}>Crear todos los Contenidos</Button>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Keyword ID</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Outline</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>Contenido</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {titles.map((title, index) => (
                  <TableRow key={index}>
                    <TableCell style={wrapTextStyle}>
                      {title.title}
                    </TableCell>
                    <TableCell>{title.keywordId}</TableCell>
                    <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                      {(title.outline && title.outline !== "") ? (
                        <Link to={`/outline/${title.id}`} target="_blank">
                          <IconButton color="success">
                            <DoneIcon />
                          </IconButton>
                        </Link>
                      ) : (
                        <IconButton color="primary" onClick={() => handleOutlineCreation(keywordPlanId, title.keywordId, title.id)}>
                          <AddIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                      {title.contentid ? (
                        <Link to={`/contenidos/${title.contentid}`} target="_blank">
                          <IconButton color="success">
                            <DoneIcon />
                          </IconButton>
                        </Link>
                      ) : (
                        <IconButton color="primary" onClick={() => handleContentCreation(keywordPlanId, title.keywordId, title.id)}>
                          <AddIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Backdrop
          open={isLoading}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress />
          <Typography variant="h6" component="div" sx={{ paddingLeft: 2 }}>
            {backdropMessage}
          </Typography>
        </Backdrop>
      </Grid>
    </Layout>
  );
}