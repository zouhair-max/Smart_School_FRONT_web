import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './services/PrivateRoute';
import DashboardRouter from './components/DashboardRouter';
import Login from './Screens/auth/Login';

// Import des dashboards par rôle
import DashboardPage from './Screens/Super_Admin/DashboardPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Redirection vers le bon dashboard selon le rôle */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          } />
          
          {/* Routes spécifiques par rôle */}
          <Route path="/Super_Admin/*" element={
            <PrivateRoute roles={['super_admin']}>
              <DashboardPage />
            </PrivateRoute>
          } />
{/*           
          <Route path="/school-admin/*" element={
            <PrivateRoute roles={['school_admin']}>
              <SchoolAdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/teacher/*" element={
            <PrivateRoute roles={['teacher']}>
              <TeacherDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/parent/*" element={
            <PrivateRoute roles={['parent']}>
              <ParentDashboard />
            </PrivateRoute>
          } /> */}
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;