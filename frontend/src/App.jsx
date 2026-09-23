import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import EventsPage from './pages/EventsPage';
import VenuesPage from './pages/VenuesPage';
import BudgetPage from './pages/BudgetPage';
import VendorsPage from './pages/VendorsPage';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/' || location.pathname === '/auth';

  return (
    <AuthProvider>
      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? '' : 'pt-16'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
