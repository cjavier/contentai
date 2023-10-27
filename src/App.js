import logo from './logo.png';
import './App.css';
import Login from './components/Accounts/Login';
import Register from './components/Accounts/Register';
import Dashboard from './components/Dashboard';
import BuyerPersonas from './components/BuyerPersona/BuyerPersonas';
import Keywords from './components/Keywords/Keywords';
import KeywordsDisplay from './components/Keywords/KeywordsDisplay';
import Titles from './components/Titles/Titles';
import Contents from './components/Contents/Contents';
import Account from './components/Accounts/Account';
import Onboarding from './components/Accounts/Onboarding';
import ContentPage from './components/Contents/ContentPage';
import OutlinePage from './components/OutlinePage';
import ForgotPassword from './components/ForgotPassword';
import Landing from './components/Landing';
import Publish from './components/Publish/Publish';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Slide from '@mui/material/Slide';
import TitlesDisplay from './components/Titles/TitlesDisplay';
import ContentsDisplay from './components/Contents/ContentsDisplay';
import ContenidosPage from './components/Contenidos';
import PublishDisplay from './components/Publish/PublishDisplay';

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
          <Route path="/publicar" element={<Publish />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/titles/:keywordPlanId" element={<TitlesDisplay />} />
          <Route path="/contents/:keywordPlanId" element={<ContentsDisplay />} />
          <Route path="/publish/:keywordPlanId" element={<PublishDisplay />} />
          <Route path="/contenidos/:contentId" element={<ContenidosPage />} />
          <Route path="/keywords/:keywordPlanId" element={<KeywordsDisplay />} />
          <Route path="/content/:keywordPlanId/:keywordId/:titleId" element={<ContentPage />} />
          <Route path="/outline/:keywordPlanId/:keywordId/:titleId" element={<OutlinePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
