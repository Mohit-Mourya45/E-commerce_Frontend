import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminLogin from './AdminViews/AdminLogin';
import VenderLogin from './VendorViews/VendorLogin';
import ProductCatgMgt from './AdminViews/ProductCatgMgt';
import ProductMgt from './AdminViews/ProductMgt';
import ProductList from './ProductViews/ProductList';
import Product from './ProductViews/Product';
import VendorMain from './VendorViews/VendorMain';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    

  <App/>
  </React.StrictMode>
);