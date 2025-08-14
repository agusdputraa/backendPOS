import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Category, Add, Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    category_name: '',
    description: ''
  });

  useEffect(() => {
    checkUserAuth();
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      checkUserAuth();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => window.removeEventListener('authStateChanged', handleAuthChange);
  }, []);

  const checkUserAuth = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role
        });
        setIsSuperadmin(payload.role === 'Superadmin');
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('authToken');
        setUser(null);
        setIsSuperadmin(false);
      }
    } else {
      setUser(null);
      setIsSuperadmin(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || []);
      setError('');
    } catch (error) {
      setError('Failed to fetch categories. Please try again.');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate('/', { state: { selectedCategory: categoryId } });
  };

  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditFormData({
      category_name: category.category_name,
      description: category.description || ''
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditFormData({});
  };

  const saveEdit = async (categoryId) => {
    try {
      await updateCategory(categoryId, editFormData);
      setEditingCategory(null);
      setEditFormData({});
      fetchCategories();
      setError('');
    } catch (error) {
      setError('Failed to update category. Please try again.');
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        fetchCategories();
        setError('');
      } catch (error) {
        setError('Failed to delete category. Please try again.');
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    try {
      await createCategory(newCategoryData);
      setOpenAddDialog(false);
      setNewCategoryData({
        category_name: '',
        description: ''
      });
      fetchCategories();
      setError('');
    } catch (error) {
      setError('Failed to create category. Please try again.');
      console.error('Error deleting category:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Product Categories
        </Typography>
        {isSuperadmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Category
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {categories.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Category sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No categories found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Categories help organize your products. {isSuperadmin ? 'Add some categories to get started!' : 'Please contact an administrator to add categories.'}
          </Typography>
          {isSuperadmin && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              size="large"
            >
              Add Your First Category
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                    backgroundColor: '#fafafa'
                  }
                }}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  {isSuperadmin && (
                    <Category sx={{ fontSize: 60, color: '#8B4513', mb: 2 }} />
                  )}
                  
                  {editingCategory === category.id && isSuperadmin ? (
                    <TextField
                      fullWidth
                      value={editFormData.category_name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, category_name: e.target.value }))}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography gutterBottom variant="h6" component="div">
                      {category.category_name}
                    </Typography>
                  )}
                  
                  {editingCategory === category.id && isSuperadmin ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      value={editFormData.description}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                      sx={{ mb: 2 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {category.description || 'No description'}
                    </Typography>
                  )}
                  
                  {isSuperadmin && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <Chip 
                        label={`ID: ${category.id}`} 
                        size="small" 
                        sx={{ 
                          borderColor: '#A0522D', 
                          color: '#A0522D',
                          '&:hover': { backgroundColor: '#A0522D', color: 'white' }
                        }}
                        variant="outlined"
                      />
                    </Box>
                  )}

                  {isSuperadmin && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      {editingCategory === category.id ? (
                        <>
                          <IconButton 
                            sx={{ color: '#8B4513' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit(category.id);
                            }}
                            size="small"
                          >
                            <Save />
                          </IconButton>
                          <IconButton 
                            color="default" 
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditing();
                            }}
                            size="small"
                          >
                            <Cancel />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton 
                            sx={{ color: '#8B4513' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(category);
                            }}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(category.id);
                            }}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {isSuperadmin && (
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Category Name"
                value={newCategoryData.category_name}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, category_name: e.target.value }))}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newCategoryData.description}
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCategory} variant="contained">Create</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CategoryList;
