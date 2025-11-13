import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRouter = () => {
  const { currentUser } = useAuth();

  const getDashboardPath = (role) => {
    const basePaths = {
      super_admin: '/Super_Admin',
      school_admin: '/School_Admin', 
      teacher: '/teacher',
      parent: '/parent'
    };

    return basePaths[role] || '/login';
  };

  const dashboardPath = getDashboardPath(currentUser?.role);
  
  return <Navigate to={dashboardPath} replace />;
};

export default DashboardRouter;