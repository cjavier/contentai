import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import PublishIcon from '@mui/icons-material/Publish';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { ElectricBolt, ManageSearch, Storage, SupervisedUserCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';


export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/buyerpersonas">
      <ListItemIcon>
        <SupervisedUserCircle />
      </ListItemIcon>
      <ListItemText primary="Buyer Personas" />
    </ListItemButton>
    <ListItemButton component={Link} to="/keywords">
      <ListItemIcon>
        <ManageSearch />
      </ListItemIcon>
      <ListItemText primary="Keywords" />
    </ListItemButton>
    <ListItemButton component={Link} to="/titulos">
      <ListItemIcon>
        <Storage />
      </ListItemIcon>
      <ListItemText primary="Títulos" />
    </ListItemButton>
    <ListItemButton component={Link} to="/contenidos">
      <ListItemIcon>
        <ElectricBolt />
      </ListItemIcon>
      <ListItemText primary="Contenido" />
    </ListItemButton>
    <ListItemButton component={Link} to="/publicar">
      <ListItemIcon>
        <PublishIcon />
      </ListItemIcon>
      <ListItemText primary="Publicar" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
