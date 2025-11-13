// Dans votre composant parent ou route
import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import DashboardPage from './DashboardDEsk';
import DashboardMobile from './DashboardMobile';

const ResponsiveDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile ? <DashboardMobile /> : <DashboardPage />;
};

export default ResponsiveDashboard;