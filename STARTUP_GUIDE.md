# Restaurant POS Application - Startup Guide

This guide will help you get both the backend and frontend running for your restaurant POS system.

## Project Structure

```
backendPOS/
├── backend/           # Node.js Express backend
│   ├── configs/      # Database configuration
│   ├── controllers/  # API controllers
│   ├── middleware/   # Authentication & upload middleware
│   ├── routes/       # API routes
│   ├── uploads/      # Product images
│   └── index.js      # Main server file
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # State management
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- MySQL database (or your preferred database)
- Git

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Database Configuration
1. Create a MySQL database for your POS system
2. Update `configs/db.js` with your database credentials
3. Import your database schema (if you have one)

### 1.3 Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
```

### 1.4 Start Backend Server
```bash
cd backend
npm start
# or
node index.js
```

The backend will start on `http://localhost:3000`

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd frontend
npm install
```

### 2.2 Start Frontend Development Server
```bash
cd frontend
npm start
```

The frontend will start on `http://localhost:3001`

## Step 3: Testing the Application

### 3.1 Backend API Test
Test if your backend is running:
```bash
curl http://localhost:3000/ping
```
Should return: "API is running Now"

### 3.2 Frontend Test
Open your browser and navigate to `http://localhost:3001`
You should see the Restaurant POS application with:
- Header navigation
- Product list (if you have products in your database)
- Category list
- Shopping cart

## Step 4: Database Setup

### 4.1 Required Tables
Make sure you have these tables in your database:

**Products Table:**
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT,
  product_price DECIMAL(10,2) NOT NULL,
  category_id INT,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Categories Table:**
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Users Table:**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 Sample Data
Insert some sample data to test the application:

```sql
-- Insert categories
INSERT INTO categories (category_name, description) VALUES 
('Main Course', 'Primary dishes'),
('Appetizers', 'Starters and snacks'),
('Beverages', 'Drinks and refreshments'),
('Desserts', 'Sweet treats');

-- Insert products
INSERT INTO products (product_name, product_description, product_price, category_id, image) VALUES 
('Grilled Chicken', 'Delicious grilled chicken with herbs', 15.99, 1, 'default-image.png'),
('Caesar Salad', 'Fresh romaine lettuce with caesar dressing', 8.99, 2, 'default-image.png'),
('Iced Coffee', 'Cold brewed coffee with cream', 4.99, 3, 'default-image.png'),
('Chocolate Cake', 'Rich chocolate cake with frosting', 6.99, 4, 'default-image.png');
```

## Step 5: Features Overview

### 5.1 Product Display
- Browse all products in a grid layout
- Search products by name
- Filter by category
- Sort by name, price, or category
- Pagination for large catalogs
- Add products to cart

### 5.2 Shopping Cart
- Add/remove items
- Adjust quantities
- Persistent storage (localStorage)
- Total calculation
- Checkout preparation

### 5.3 Category Management
- View all product categories
- Category information display

## Step 6: Troubleshooting

### 6.1 Common Issues

**Backend won't start:**
- Check if port 3000 is available
- Verify database connection
- Check environment variables

**Frontend won't connect to backend:**
- Ensure backend is running on port 3000
- Check CORS configuration
- Verify API endpoints

**Database connection issues:**
- Check database credentials
- Ensure database service is running
- Verify database exists

### 6.2 Logs
- Backend logs appear in the terminal
- Frontend logs appear in browser console (F12)

## Step 7: Development

### 7.1 Backend Development
- API endpoints are in `routes/` directory
- Business logic is in `controllers/` directory
- Middleware for auth and uploads

### 7.2 Frontend Development
- Components are in `src/components/`
- API services in `src/services/`
- State management with React Context

### 7.3 Adding New Features
1. Create new routes in backend
2. Add controllers for business logic
3. Create React components for UI
4. Update API services
5. Test thoroughly

## Step 8: Production Deployment

### 8.1 Backend Deployment
- Use PM2 or similar process manager
- Set up environment variables
- Configure reverse proxy (nginx)
- Set up SSL certificates

### 8.2 Frontend Deployment
```bash
cd frontend
npm run build
```
Deploy the `build/` folder to your hosting service

## Support

If you encounter issues:
1. Check the logs
2. Verify all dependencies are installed
3. Ensure database is properly configured
4. Check network connectivity between frontend and backend

## Next Steps

Once the basic application is running, consider adding:
- User authentication and authorization
- Order management system
- Payment processing
- Inventory management
- Sales reporting
- Receipt printing
- Table management for restaurants

Happy coding! 🍕🍔🍟
