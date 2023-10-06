import logo from './logo.svg';
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
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/buyerpersonas" element={<BuyerPersonas />} />
          <Route path="/keywords" element={<Keywords />} />
          <Route path="/titulos" element={<Titles />} />
          <Route path="/contenidos" element={<Contents />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/onboarding" element={<Onboarding />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
