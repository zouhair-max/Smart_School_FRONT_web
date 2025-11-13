// src/components/SuperAdminDashboard/Dashboard.jsx
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
  Chip,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  IconButton,
  Avatar,
  Badge,
  Collapse,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import {
  School,
  People,
  TrendingUp,
  Warning,
  Notifications,
  CalendarToday,
  Subject,
  Class,
  BarChart,
  Dashboard as DashboardIcon,
  Business,
  Group,
  MenuBook,
  Settings,
  History,
  NotificationsActive,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Logout,
  AccountCircle,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import OverviewStats from './components/OverviewStats';
import SchoolsStatus from './components/SchoolsStatus';
import UsersStatus from './components/UsersStatus';

import { dashboardAPI } from './services/api';
import { useAuth } from '../../context/AuthContext';


const drawerWidth = 280;
const collapsedDrawerWidth = 80;

const menuItems = [
  { id: 'overview', label: 'Overview', icon: <DashboardIcon />, color: '#7C3AED' },
  { id: 'schools', label: 'Schools', icon: <Business />, color: '#8B5CF6' },
  { id: 'users', label: 'Users', icon: <Group />, color: '#EC4899' },
  
];

const DashboardPage = () => {
  const theme = useTheme();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const refreshSection = async (section) => {
    try {
      const endpoints = {
        overview: 'overview',
        schools: 'schools',
        users: 'users',
        academic: 'academic',
        activities: 'activities',
        'system-health': 'system-health',
      };

      const response = await dashboardAPI.getSection(endpoints[section]);
      if (response.data.success) {
        setDashboardData(prev => ({
          ...prev,
          [section]: response.data.data
        }));
      }
    } catch (err) {
      console.error(`Failed to refresh ${section}:`, err);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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

  const getUserEmail = () => {
    return currentUser?.email || 'admin@edu.com';
  };

const renderSectionContent = () => {
  switch (activeSection) {
    case 'overview':
      return (
        <Grid container spacing={3}>
          {/* Overview Stats */}
          <Grid item xs={12}>
            <OverviewStats 
              data={dashboardData} 
              onRefresh={() => refreshSection('overview')}
            />
          </Grid>
          
        
        </Grid>
      );
    
    // Gardez les autres sections individuelles
    case 'schools':
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SchoolsStatus 
              data={dashboardData.schools} 
              onRefresh={() => refreshSection('schools')}
              expanded
            />
          </Grid>
        </Grid>
      );
    
    case 'users':
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <UsersStatus 
              data={dashboardData.users} 
              onRefresh={() => refreshSection('users')}
              expanded
            />
          </Grid>
        </Grid>
      );
    

    
   
    
   
    default:
      return (
        <OverviewStats 
          data={dashboardData.overview} 
          onRefresh={() => refreshSection('overview')}
        />
      );
  }
};

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15), transparent 70%)',
          pointerEvents: 'none',
        }
      }}
    >
      {/* Header Section avec bouton de toggle */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          {!sidebarCollapsed && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(124, 58, 237, 0.3)',
                }}
              >
                <School sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1, ml: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    letterSpacing: '-0.5px',
                    fontSize: '1.1rem',
                  }}
                >
                  EduAdmin
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: alpha('#ffffff', 0.6),
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                >
                  Super Admin Panel
                </Typography>
              </Box>
              <IconButton
                onClick={handleSidebarToggle}
                sx={{
                  color: alpha('#ffffff', 0.7),
                  '&:hover': {
                    color: 'white',
                    background: alpha('#ffffff', 0.1),
                  },
                }}
              >
                <ChevronLeft />
              </IconButton>
            </Box>
          )}
          {sidebarCollapsed && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                  mb: 2,
                }}
              >
                <School sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <IconButton
                onClick={handleSidebarToggle}
                sx={{
                  color: alpha('#ffffff', 0.7),
                  '&:hover': {
                    color: 'white',
                    background: alpha('#ffffff', 0.1),
                  },
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Admin Profile Card */}
        {!sidebarCollapsed && (
          <Card
            sx={{
              background: alpha('#ffffff', 0.05),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: alpha('#ffffff', 0.08),
                borderColor: alpha('#ffffff', 0.2),
              },
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#10B981',
                      boxShadow: '0 0 0 2px #1e293b',
                      border: '2px solid #1e1b4b',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #EC4899 0%, #F59E0B 100%)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getUserDisplayName()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha('#ffffff', 0.6),
                      fontSize: '0.7rem',
                    }}
                  >
                    {getUserEmail()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha('#ffffff', 0.1), my: 1 }} />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {menuItems.map((item, index) => {
          const isActive = activeSection === item.id;
          return (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                mb: 0.5,
                animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                '@keyframes slideIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateX(-20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateX(0)',
                  },
                },
              }}
            >
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '12px',
                  minHeight: 48,
                  px: sidebarCollapsed ? 1.5 : 2,
                  py: 1.5,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  ...(isActive && {
                    background: `linear-gradient(135deg, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.1)} 100%)`,
                    boxShadow: `0 4px 12px ${alpha(item.color, 0.3)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '24px',
                      borderRadius: '0 4px 4px 0',
                      background: item.color,
                    },
                  }),
                  '&:hover': {
                    background: isActive
                      ? `linear-gradient(135deg, ${alpha(item.color, 0.25)} 0%, ${alpha(item.color, 0.15)} 100%)`
                      : alpha('#ffffff', 0.05),
                    transform: sidebarCollapsed ? 'scale(1.05)' : 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    color: isActive ? item.color : alpha('#ffffff', 0.7),
                    transition: 'all 0.3s ease',
                    '& svg': {
                      fontSize: sidebarCollapsed ? 20 : 22,
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!sidebarCollapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'white' : alpha('#ffffff', 0.8),
                    }}
                    sx={{ ml: 2 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer Actions */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#ffffff', 0.1)}` }}>
        {!sidebarCollapsed && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: '12px',
              background: alpha('#ffffff', 0.05),
              border: `1px solid ${alpha('#ffffff', 0.1)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: alpha('#ffffff', 0.08),
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.8), fontWeight: 600 }}>
                System Status
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.6), fontSize: '0.7rem' }}>
              All systems operational
            </Typography>
          </Box>
        )}
        
        <IconButton
          onClick={handleLogoutClick}
          sx={{
            width: '100%',
            borderRadius: '12px',
            color: alpha('#ffffff', 0.8),
            background: alpha('#ffffff', 0.05),
            border: `1px solid ${alpha('#ffffff', 0.1)}`,
            '&:hover': {
              background: alpha('#ffffff', 0.1),
              color: '#EF4444',
              borderColor: alpha('#EF4444', 0.3),
            },
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            py: 1.5,
            transition: 'all 0.3s ease',
          }}
        >
          <Logout sx={{ fontSize: 20 }} />
          {!sidebarCollapsed && (
            <Typography variant="body2" sx={{ ml: 1, fontWeight: 500 }}>
              Logout
            </Typography>
          )}
        </IconButton>
      </Box>
    </Box>
  );

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <Button 
            color="inherit" 
            size="small"
            onClick={() => window.location.href = '/login'}
          >
            Se connecter
          </Button>
        }>
          Vous devez être connecté pour accéder à cette page
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#7C3AED',
              mb: 2 
            }} 
          />
          <Typography variant="h6" color="text.secondary">
            Chargement du tableau de bord...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }} >
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
          sx={{
            borderRadius: '12px',
            border: '1px solid #FECACA',
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="warning"
          sx={{
            borderRadius: '12px',
            border: '1px solid #FEF3C7',
          }}
        >
          Aucune donnée de tableau de bord disponible
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: '#f8fafc', 
      minHeight: '100vh',
      background: '$',
    }}>
      <CssBaseline />
      
      {/* Sidebar Drawer avec marge */}
      <Box
        component="nav"
        sx={{ 
          width: { 
            sm: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth 
          }, 
          flexShrink: { sm: 0 },
          m: 2,
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              borderRadius: '20px',
              m: 2.5,
              mt: 10,
              height: `calc(100% - 60px)`,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
              border: 'none',
              borderRadius: '20px',
              m: 2,
              height: `calc(100% - 65px)`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content avec ajustement pour la marge */}
    {/* Main Content avec ajustement pour la marge */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { 
            sm: `calc(98% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px - 40px)` 
          },
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Top AppBar */}
       <AppBar
  position="fixed"
  elevation={0}
  sx={{
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
    overflow: 'hidden',
    backdropFilter: 'blur(8px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    zIndex: (theme) => theme.zIndex.drawer + 1,
    width: { 
      xs: '90%',
      sm: `calc(99% - ${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px - 32px)` 
    },
    ml: { 
      xs: 0,
      sm: `${sidebarCollapsed ? collapsedDrawerWidth : drawerWidth}px` 
    },
    mr: { sm: 2 },
    mt:2 ,
    mb: 3,
    borderRadius: { sm: '20px' },
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '180px',
      background:
        'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15), transparent 70%)',
      pointerEvents: 'none',
    },
  }}
>
          <Toolbar sx={{ px: 3, py: 1, position: 'relative', zIndex: 1 }}>
            {/* Menu Icon (mobile) */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { sm: 'none' },
                color: 'rgba(255,255,255,0.9)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Title */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                  letterSpacing: '0.5px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Welcome back, {getUserDisplayName()}
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
             

              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  p: 0.5,
                  border: '2px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    border: '2px solid rgba(255,255,255,0.4)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>

           
            </Box>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          {renderSectionContent()}
        </Container>
      </Box>

      {/* Dialog de confirmation de déconnexion */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
            background: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
          color: 'white',
          textAlign: 'center',
        }}>
          Confirmer la déconnexion
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={2}>
            <Logout sx={{ fontSize: 48, color: '#7C3AED', mb: 2 }} />
            <DialogContentText>
              Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1, justifyContent: 'center' }}>
          <Button 
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{ 
              borderRadius: '12px',
              px: 4,
              borderColor: '#E5E7EB',
              color: '#6B7280',
              '&:hover': {
                borderColor: '#7C3AED',
                color: '#7C3AED',
              },
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleLogoutConfirm}
            variant="contained"
            sx={{ 
              borderRadius: '12px',
              px: 4,
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
              },
            }}
            startIcon={<Logout />}
          >
            Se déconnecter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;