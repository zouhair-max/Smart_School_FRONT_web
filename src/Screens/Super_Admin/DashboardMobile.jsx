// src/components/SuperAdminDashboard/DashboardMobile.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Container,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardContent,
  Drawer,
  IconButton,
  Avatar,
  Badge,
  SwipeableDrawer,
  useMediaQuery,
  Fab,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  School,
  People,
  TrendingUp,
  Warning,
  Notifications,
  Dashboard as DashboardIcon,
  Business,
  Group,
  Menu as MenuIcon,
  Logout,
  AccountCircle,
  MoreVert,
  Home,
  Settings,
  Refresh,
} from '@mui/icons-material';
import OverviewStats from './components/OverviewStats';
import SchoolsStatus from './components/SchoolsStatus';
import UsersStatus from './components/UsersStatus';
import { dashboardAPI } from './services/api';
import { useAuth } from '../../context/AuthContext';

const DashboardMobile = () => {
 

  const { currentUser, logout, isAuthenticated } = useAuth();
  
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const mobileMenuItems = [
    { id: 'overview', label: 'Accueil', icon: <Home />, color: '#7C3AED' },
    { id: 'schools', label: 'Écoles', icon: <Business />, color: '#8B5CF6' },
    { id: 'users', label: 'Utilisateurs', icon: <Group />, color: '#EC4899' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      setError('Vous devez être connecté pour accéder au dashboard');
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const refreshSection = async (section) => {
    try {
      setRefreshing(true);
      const endpoints = {
        overview: 'overview',
        schools: 'schools',
        users: 'users',
      };
      const response = await dashboardAPI.getSection(endpoints[section]);
      if (response.data.success) {
        setDashboardData(prev => ({
          ...prev,
          [section]: response.data.data
        }));
      }
    } catch (err) {
      console.error(`Erreur lors de l'actualisation:`, err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
    handleProfileMenuClose();
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    await logout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const getUserInitials = () => {
    if (!currentUser?.name) return 'SA';
    return currentUser.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return currentUser?.name || currentUser?.email || 'Super Admin';
  };

  const renderSectionContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Box textAlign="center">
            <CircularProgress size={40} sx={{ color: '#7C3AED', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Chargement...
            </Typography>
          </Box>
        </Box>
      );
    }

    if (error && !dashboardData) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert 
            severity="error"
            action={
              <Button 
                onClick={fetchDashboardData} 
                color="inherit" 
                size="small"
              >
                Réessayer
              </Button>
            }
            sx={{ borderRadius: '12px' }}
          >
            {error}
          </Alert>
        </Box>
      );
    }

    switch (activeSection) {
      case 'overview':
        return (
          <Box sx={{ p: 2 }}>
            <OverviewStats 
              data={dashboardData} 
              onRefresh={() => refreshSection('overview')}
              mobile
            />
          </Box>
        );
      
      case 'schools':
        return (
          <Box sx={{ p: 2 }}>
            <SchoolsStatus 
              data={dashboardData?.schools} 
              onRefresh={() => refreshSection('schools')}
              mobile
            />
          </Box>
        );
      
      case 'users':
        return (
          <Box sx={{ p: 2 }}>
            <UsersStatus 
              data={dashboardData?.users} 
              onRefresh={() => refreshSection('users')}
              mobile
            />
          </Box>
        );
      
      default:
        return (
          <Box sx={{ p: 2 }}>
            <OverviewStats 
              data={dashboardData} 
              onRefresh={() => refreshSection('overview')}
              mobile
            />
          </Box>
        );
    }
  };

  const MobileMenuDrawer = () => (
    <SwipeableDrawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      onOpen={() => setMobileMenuOpen(true)}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 280,
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px rgba(124, 58, 237, 0.3)',
          }}
        >
          <School sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          EduAdmin
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Super Admin Panel
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#10B981',
                boxShadow: '0 0 0 2px #1e293b',
              },
            }}
          >
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
                fontWeight: 600,
              }}
            >
              {getUserInitials()}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {getUserDisplayName()}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              {currentUser?.email || 'admin@edu.com'}
            </Typography>
          </Box>
        </Box>

        <List sx={{ mt: 2 }}>
          {mobileMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={activeSection === item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`,
                  },
                }}
              >
                <ListItemIcon sx={{ color: activeSection === item.id ? item.color : 'rgba(255,255,255,0.7)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: activeSection === item.id ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button
            fullWidth
            startIcon={<Logout />}
            onClick={handleLogoutClick}
            sx={{
              color: 'rgba(255,255,255,0.8)',
              justifyContent: 'flex-start',
              pl: 2,
              '&:hover': {
                color: '#EF4444',
                background: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            Se déconnecter
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );

  if (!isAuthenticated) {
    return (
      <Container sx={{ mt: 4, p: 2 }}>
        <Alert 
          severity="error" 
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => window.location.href = '/login'}
            >
              Se connecter
            </Button>
          }
        >
          Vous devez être connecté pour accéder à cette page
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: '#f8fafc',
      pb: 7, // Espace pour la bottom navigation
    }}>
      {/* Header Mobile */}
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
              {mobileMenuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {getUserDisplayName()}
            </Typography>
          </Box>

          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {getUserInitials()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu de profil */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Mon profil
        </MenuItem>
        <MenuItem onClick={handleLogoutClick}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Se déconnecter
        </MenuItem>
      </Menu>

      {/* Contenu principal */}
      <Box component="main" sx={{ flexGrow: 1, overflow: 'auto' }}>
        {renderSectionContent()}
      </Box>

      {/* Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
        elevation={3}
      >
        <BottomNavigation
          value={activeSection}
          onChange={(event, newValue) => {
            setActiveSection(newValue);
          }}
          sx={{
            background: 'white',
            borderRadius: '20px 20px 0 0',
            height: 70,
          }}
        >
          {mobileMenuItems.map((item) => (
            <BottomNavigationAction
              key={item.id}
              value={item.id}
              icon={item.icon}
              label={item.label}
              sx={{
                minWidth: 'auto',
                color: activeSection === item.id ? item.color : 'text.secondary',
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  fontWeight: activeSection === item.id ? 600 : 400,
                },
              }}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {/* Bouton d'actualisation flottant */}
      <Fab
        color="primary"
        aria-label="refresh"
        onClick={() => refreshSection(activeSection)}
        disabled={refreshing}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
          },
        }}
      >
        {refreshing ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
      </Fab>

      {/* Menu mobile */}
      <MobileMenuDrawer />

      {/* Dialog de déconnexion */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            m: 2,
            maxWidth: 'calc(100% - 32px)',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
          Se déconnecter ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText textAlign="center">
            Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={handleLogoutCancel}
            variant="outlined"
            fullWidth
            sx={{ borderRadius: '12px' }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleLogoutConfirm}
            variant="contained"
            fullWidth
            sx={{ 
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            }}
          >
            Se déconnecter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardMobile;