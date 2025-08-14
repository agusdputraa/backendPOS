import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken');
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    
    window.dispatchEvent(new CustomEvent('authStateChanged', { 
      detail: { isAuthenticated: false, user: null } 
    }));
    
    navigate('/');
  };

  useEffect(() => {
    const handleAuthChange = (event) => {
      if (event.detail.isAuthenticated) {
        setUser(event.detail.user);
      }
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <img 
          src="/logo192.png" 
          alt="Dapur El Noor Logo" 
          style={{ 
            width: '32px', 
            height: '32px', 
            marginRight: '16px',
            borderRadius: '4px'
          }} 
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Dapur El Noor POS
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            Products
          </Button>
          <Button color="inherit" onClick={() => navigate('/categories')}>
            Categories
          </Button>
          
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout ({user.email})
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
