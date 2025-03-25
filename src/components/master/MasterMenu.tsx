import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';

const MasterMenu: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage="マスタメンテ" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* プルダウン項目マスタ */}
          <Link to="/master/dropdown" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">👤</span>
              <h2 className="text-xl font-semibold">プルダウン項目マスタ</h2>
            </div>
          </Link>
          
          {/* 拠点マスタ */}
          <Link to="/master/location" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🏢</span>
              <h2 className="text-xl font-semibold">拠点マスタ</h2>
            </div>
          </Link>
          
          {/* 税率マスタ */}
          <Link to="/master/tax" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">✅</span>
              <h2 className="text-xl font-semibold">税率マスタ</h2>
            </div>
          </Link>
          
          {/* 商品マスタ */}
          <Link to="/master/product" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">📦</span>
              <h2 className="text-xl font-semibold">商品マスタ</h2>
            </div>
          </Link>
          
          {/* 仕入先マスタ */}
          <Link to="/master/supplier" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🏭</span>
              <h2 className="text-xl font-semibold">仕入先マスタ</h2>
            </div>
          </Link>
          
          {/* 得意先マスタ */}
          <Link to="/master/customer" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🏪</span>
              <h2 className="text-xl font-semibold">得意先マスタ</h2>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MasterMenu;
