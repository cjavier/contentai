import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Layout from './Layout';

export default function Dashboard() {
  return (
    <Layout>
        {/* Recent Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <h1>Comienza a crear tu contenido con AI</h1>
          </Paper>
        </Grid>
    </Layout>
  );
}
