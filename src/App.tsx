import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MenuGrid from './components/menu/MenuGrid';
import MasterMenu from './components/master/MasterMenu';
import TaxMaster from './components/master/TaxMaster';
import LocationMaster from './components/master/LocationMaster';
import DropdownMaster from './components/master/DropdownMaster';
import StaffMaster from './components/master/StaffMaster';
import ProductMaster from './components/master/ProductMaster';
import SupplierMaster from './components/master/SupplierMaster';
import CustomerMaster from './components/master/CustomerMaster';
import CustomerList from './components/master/CustomerList';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<PrivateRoute><MenuGrid /></PrivateRoute>} />
          
          {/* マスタメンテナンス関連 */}
          <Route path="/master" element={<PrivateRoute><MasterMenu /></PrivateRoute>} />
          <Route path="/master/tax" element={<PrivateRoute><TaxMaster /></PrivateRoute>} />
          <Route path="/master/location" element={<PrivateRoute><LocationMaster /></PrivateRoute>} />
          <Route path="/master/dropdown" element={<PrivateRoute><DropdownMaster /></PrivateRoute>} />
          <Route path="/master/staff" element={<PrivateRoute><StaffMaster /></PrivateRoute>} />
          <Route path="/master/product" element={<PrivateRoute><ProductMaster /></PrivateRoute>} />
          <Route path="/master/supplier" element={<PrivateRoute><SupplierMaster /></PrivateRoute>} />
          
          {/* 得意先マスタ関連 */}
          <Route path="/master/customer" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
          <Route path="/master/customer/new" element={<PrivateRoute><CustomerMaster /></PrivateRoute>} />
          <Route path="/master/customer/edit/:id" element={<PrivateRoute><CustomerMaster /></PrivateRoute>} />
          <Route path="/master/customer/:id" element={<PrivateRoute><CustomerMaster /></PrivateRoute>} />
          
          {/* 存在しないパスの場合はホームにリダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
