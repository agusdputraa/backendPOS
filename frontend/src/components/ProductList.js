import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Search, Edit, Delete, Add, Save, Cancel } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts, getCategories, updateProduct, deleteProduct, createProduct } from '../services/api';

const ProductList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('product_name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const [user, setUser] = useState(null);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newProductData, setNewProductData] = useState({
    product_name: '',
    product_description: '',
    product_price: '',
    category_id: '',
    image: null
  });

  useEffect(() => {
    checkUserAuth();
    fetchCategories();
    
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

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
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: selectedCategory,
        sortBy,
        sortOrder,
        page,
        limit: 12
      };
      
      const response = await getProducts(params);
      setProducts(response.data);
      setTotalPages(response.totalPages);
      setTotalProducts(response.total);
      setError('');
    } catch (error) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, sortOrder, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory('');
    setPage(1);
  };

  const startEditing = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      product_name: product.product_name,
      product_description: product.product_description || '',
      product_price: product.product_price,
      category_id: product.category_id || ''
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  const saveEdit = async (productId) => {
    try {
      await updateProduct(productId, editFormData);
      setEditingProduct(null);
      setEditFormData({});
      fetchProducts();
      setError('');
    } catch (error) {
      setError('Failed to update product. Please try again.');
      console.error('Error updating product:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
        setError('');
      } catch (error) {
        setError('Failed to delete product. Please try again.');
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleAddProduct = async () => {
    try {
      await createProduct(newProductData);
      setOpenAddDialog(false);
      setNewProductData({
        product_name: '',
        product_description: '',
        product_price: '',
        category_id: '',
        image: null
      });
      fetchProducts();
      setError('');
    } catch (error) {
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', error);
    }
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const currentCategoryName = categories.find(cat => cat.id == selectedCategory)?.category_name;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {currentCategoryName ? `${currentCategoryName} Products` : 'Our Menu'}
        </Typography>
        {isSuperadmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddDialog(true)}
          >
            Add Product
          </Button>
        )}
      </Box>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="Search products"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 200 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.category_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="product_name">Name</MenuItem>
            <MenuItem value="product_price">Price</MenuItem>
            <MenuItem value="category_name">Category</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder}
            label="Order"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="ASC">Asc</MenuItem>
            <MenuItem value="DESC">Desc</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || '/default-image.png'}
                alt={product.product_name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {editingProduct === product.id && isSuperadmin ? (
                  <TextField
                    fullWidth
                    value={editFormData.product_name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, product_name: e.target.value }))}
                    sx={{ mb: 1 }}
                  />
                ) : (
                  <Typography gutterBottom variant="h6" component="div">
                    {product.product_name}
                  </Typography>
                )}

                {editingProduct === product.id && isSuperadmin ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={editFormData.product_description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, product_description: e.target.value }))}
                    sx={{ mb: 1 }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {product.product_description || 'No description available'}
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  {editingProduct === product.id && isSuperadmin ? (
                    <TextField
                      type="number"
                      value={editFormData.product_price}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, product_price: e.target.value }))}
                      sx={{ width: 100 }}
                    />
                  ) : (
                    <Typography variant="h6" sx={{ color: '#8B4513' }}>
                      Rp {product.product_price?.toLocaleString()}
                    </Typography>
                  )}
                  
                  {product.category_name && (
                    <Chip 
                      label={product.category_name} 
                      size="small" 
                      sx={{ 
                        borderColor: '#A0522D', 
                        color: '#A0522D',
                        '&:hover': { backgroundColor: '#A0522D', color: 'white' }
                      }}
                      variant="outlined"
                    />
                  )}
                </Box>

                {isSuperadmin && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {editingProduct === product.id ? (
                      <>
                        <IconButton 
                          sx={{ color: '#8B4513' }}
                          onClick={() => saveEdit(product.id)}
                          size="small"
                        >
                          <Save />
                        </IconButton>
                        <IconButton 
                          color="default" 
                          onClick={cancelEditing}
                          size="small"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton 
                          sx={{ color: '#8B4513' }}
                          onClick={() => startEditing(product)}
                          size="small"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(product.id)}
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

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{ '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#8B4513' } }}
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {products.length} of {totalProducts} products
          {currentCategoryName && ` in ${currentCategoryName}`}
        </Typography>
      </Box>

      {isSuperadmin && (
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Product Name"
                    value={newProductData.product_name}
                    onChange={(e) => setNewProductData(prev => ({ ...prev, product_name: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={newProductData.product_description}
                    onChange={(e) => setNewProductData(prev => ({ ...prev, product_description: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Price"
                    type="number"
                    value={newProductData.product_price}
                    onChange={(e) => setNewProductData(prev => ({ ...prev, product_price: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newProductData.category_id}
                      onChange={(e) => setNewProductData(prev => ({ ...prev, category_id: e.target.value }))}
                      label="Category"
                    >
                      <MenuItem value="">No Category</MenuItem>
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddProduct} variant="contained">Create</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ProductList;
