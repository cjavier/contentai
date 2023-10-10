import logo from './logo.png';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import BuyerPersonas from './components/BuyerPersonas';
import Keywords from './components/Keywords';
import Titles from './components/Titles';
import Contents from './components/Contents';
import Account from './components/Account';
import Onboarding from './components/Onboarding';
import ContentPage from './components/ContentPage';
import OutlinePage from './components/OutlinePage';
import ForgotPassword from './components/ForgotPassword';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Slide from '@mui/material/Slide';

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buyerpersonas" element={<BuyerPersonas />} />
          <Route path="/keywords" element={<Keywords />} />
          <Route path="/titulos" element={<Titles />} />
          <Route path="/contenidos" element={<Contents />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/content/:keywordPlanId/:keywordId/:titleId" element={<ContentPage />} />
          <Route path="/outline/:keywordPlanId/:keywordId/:titleId" element={<OutlinePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
