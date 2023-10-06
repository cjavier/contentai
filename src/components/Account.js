import React, { useContext } from 'react';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import Layout from './Layout';
import Logout from './Logout';
import AccountSettings from './AccountSettings';
import { AuthContext } from '../AuthContext'; 



export default function Account() {

const { currentUser } = useContext(AuthContext); // Obtener currentUser desde AuthContext


return (
  <Layout>
      <Grid item xs={12}>
          <AccountSettings />
          <Box mt={2}> {/* Esto añade un margen superior de 2 unidades */}
              <Logout />
          </Box>
      </Grid>
  </Layout>
);
}
