import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header';
import MenuGrid from './components/menu/MenuGrid';
import MasterMenu from './components/master/MasterMenu';
import StaffMaster from './components/master/StaffMaster';
import LocationMaster from './components/master/LocationMaster';
import TaxMaster from './components/master/TaxMaster';
import ProductMaster from './components/master/ProductMaster';
import SupplierMaster from './components/master/SupplierMaster';
import CustomerMaster from './components/master/CustomerMaster';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './components/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 認証が不要なルート */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* 認証が必要なルート */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={
              <div className="flex flex-col h-screen bg-gray-100">
                <Header />
                <main className="flex-grow overflow-auto">
                  <div className="container mx-auto py-4">
                    <MenuGrid />
                  </div>
                </main>
              </div>
            } />
            <Route path="/master" element={<MasterMenu />} />
            <Route path="/master/staff" element={<StaffMaster />} />
            <Route path="/master/location" element={<LocationMaster />} />
            <Route path="/master/tax" element={<TaxMaster />} />
            <Route path="/master/product" element={<ProductMaster />} />
            <Route path="/master/supplier" element={<SupplierMaster />} />
            <Route path="/master/customer" element={<CustomerMaster />} />
          </Route>
          
          {/* 存在しないルートへのアクセスはログインページにリダイレクト */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
