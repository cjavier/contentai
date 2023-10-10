import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Layout from './Layout';
import Box from '@mui/material/Box';  

export default function Dashboard() {
  return (
    <Layout>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <h1>Comienza a crear tu contenido con AI</h1>
            <p>Sigue esta guía para usar la aplicación de manera efectiva en poco tiempo</p>
            {/* Inserta el video de YouTube aquí */}
            <Box sx={{ mt: 2 }}>
              <iframe 
                width="100%" 
                height="315" 
                src="https://www.youtube.com/embed/3R80X9o456o" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </Box>
          </Paper>
        </Grid>
    </Layout>
  );
}