import React from 'react';
import ReactDOM from 'react-dom';
import AuthProvider from './context/AuthContext';
import './index.css';
import App from './App';
import 'react-datepicker/dist/react-datepicker.css';

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
);
