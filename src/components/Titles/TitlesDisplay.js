import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import Layout from '../Layout/Layout';
import { AuthContext } from '../../AuthContext';
import axios from 'axios'; // Import axios for HTTP requests

export default function TitlesDisplay() {
  const [titles, setTitles] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const { keywordPlanId } = useParams();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;


  useEffect(() => {
    if (!currentUser) {
      console.error('Usuario no autenticado. No se pueden cargar los títulos.');
      return;
    }

    const loadTitles = async () => {
      try {
        // Fetch all titles associated with the keyword plan
        const response = await axios.get(`${backendUrl}/keywordplans/${keywordPlanId}/titles`);
        const titlesData = response.data.titles;

        setTitles(titlesData);
      } catch (error) {
        console.error('Error al cargar los títulos:', error);
      }
    };

    loadTitles();
  }, [currentUser, keywordPlanId]);

  const handleDeleteTitle = async (titleId) => {
    try {
      // Delete the title
      await axios.delete(`${backendUrl}/titles/${titleId}`);

      console.log('Título eliminado exitosamente.');

      // Update the state by removing the deleted title
      setTitles((prevTitles) => prevTitles.filter((title) => title.id !== titleId));
    } catch (error) {
      console.error('Error al eliminar el título:', error);
    }
  };

  const startEditing = (titleId, currentTitle) => {
    setEditingTitleId(titleId);
    setEditedTitle(currentTitle);
  };

  const handleEditTitle = async (titleId) => {
    try {
      // Update the title in the backend
      await axios.put(`${backendUrl}/titles/${titleId}`, { title: editedTitle });

      // Update the local state
      setTitles((prevTitles) =>
        prevTitles.map((title) =>
          title.id === titleId ? { ...title, title: editedTitle } : title
        )
      );

      // Exit edit mode
      setEditingTitleId(null);
      setEditedTitle('');
    } catch (error) {
      console.error('Error al editar el título:', error);
    }
  };

  const wrapTextStyle = {
    maxWidth: '150px',
    whiteSpace: 'normal',
    maxHeight: '60px',
    overflow: 'auto'
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
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <Title>Títulos del Keyword Plan</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Keyword ID</TableCell>
                <TableCell sx={{ width: '15%', textAlign: 'right' }}>Edit</TableCell>
                <TableCell sx={{ width: '15%', textAlign: 'right' }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {titles.map((title) => (
                <TableRow key={title.id}>
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
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>{title.keywordId}</TableCell>
                  <TableCell sx={{ width: '15%', textAlign: 'right' }}>
                    {editingTitleId === title.id ? (
                      <Button onClick={() => handleEditTitle(title.id)}>Guardar</Button>
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
                      onClick={() => handleDeleteTitle(title.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Layout>
  );
}