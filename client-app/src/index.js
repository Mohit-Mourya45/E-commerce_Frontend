import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import AdminLogin from './AdminViews/AdminLogin';
import VenderLogin from './VendorViews/VendorLogin';
import ProductCatgMgt from './AdminViews/ProductCatgMgt';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <App/>
  </React.StrictMode>
);