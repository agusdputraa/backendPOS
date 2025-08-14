# Restaurant POS Frontend

A modern React-based Point of Sale (POS) system for restaurants, built with Material-UI and integrated with a Node.js backend.

## Features

- **Product Display**: Browse and search through restaurant menu items
- **Category Management**: View product categories
- **Shopping Cart**: Add items to cart with quantity management
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Built with Material-UI components for a professional look

## Tech Stack

- **React 18**: Modern React with hooks and functional components
- **Material-UI (MUI)**: Professional UI component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Context API**: State management for shopping cart

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Navigation header
│   ├── ProductList.js  # Main product display
│   ├── CategoryList.js # Category display
│   └── Cart.js         # Shopping cart
├── contexts/           # React contexts
│   └── CartContext.js  # Shopping cart state management
├── services/           # API services
│   └── api.js          # Backend API integration
├── App.js              # Main application component
└── index.js            # Application entry point
```

## API Integration

The frontend communicates with the backend through RESTful API endpoints:

- **Products**: `/products` - CRUD operations for menu items
- **Categories**: `/categories` - Product category management
- **Users**: `/users` - Authentication and user management

## Features in Detail

### Product Display
- Grid layout with product cards
- Search functionality
- Category filtering
- Sorting options (name, price, category)
- Pagination for large catalogs
- Add to cart functionality

### Shopping Cart
- Persistent cart storage (localStorage)
- Quantity management
- Item removal
- Total calculation
- Checkout preparation

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes

## Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

### Code Style

- ESLint configuration included
- Prettier formatting recommended
- Component-based architecture
- Functional components with hooks

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `build/` folder to your hosting service
3. Ensure the backend API is accessible from your frontend domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the backend documentation or create an issue in the repository.
