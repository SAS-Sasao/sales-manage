import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';

const MenuGrid: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage="メニュー" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 機能選択 */}
          <Link to="/function-select" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">📋</span>
              <h2 className="text-xl font-semibold">機能選択</h2>
            </div>
          </Link>
          
          {/* 受注管理 */}
          <Link to="/order-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🚢</span>
              <h2 className="text-xl font-semibold">受注管理</h2>
            </div>
          </Link>
          
          {/* 出荷管理 */}
          <Link to="/shipping-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🚚</span>
              <h2 className="text-xl font-semibold">出荷管理</h2>
            </div>
          </Link>
          
          {/* 請求管理 */}
          <Link to="/billing-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">💰</span>
              <h2 className="text-xl font-semibold">請求管理</h2>
            </div>
          </Link>
          
          {/* 入荷管理 */}
          <Link to="/receiving-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">📦</span>
              <h2 className="text-xl font-semibold">入荷管理</h2>
            </div>
          </Link>
          
          {/* 支払管理 */}
          <Link to="/payment-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">💳</span>
              <h2 className="text-xl font-semibold">支払管理</h2>
            </div>
          </Link>
          
          {/* マスタメンテ */}
          <Link to="/master" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🔧</span>
              <h2 className="text-xl font-semibold">マスタメンテ</h2>
            </div>
          </Link>
          
          {/* 共通管理 */}
          <Link to="/common-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🔄</span>
              <h2 className="text-xl font-semibold">共通管理</h2>
            </div>
          </Link>
          
          {/* 売上管理 */}
          <Link to="/sales-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">📊</span>
              <h2 className="text-xl font-semibold">売上管理</h2>
            </div>
          </Link>
          
          {/* 在庫管理 */}
          <Link to="/inventory-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">📝</span>
              <h2 className="text-xl font-semibold">在庫管理</h2>
            </div>
          </Link>
          
          {/* 問合せ管理 */}
          <Link to="/inquiry-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">❓</span>
              <h2 className="text-xl font-semibold">問合せ管理</h2>
            </div>
          </Link>
          
          {/* システム管理 */}
          <Link to="/system-management" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">⚙️</span>
              <h2 className="text-xl font-semibold">システム管理</h2>
            </div>
          </Link>
          
          {/* ログアウト */}
          <Link to="/login" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-red-200">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🚪</span>
              <h2 className="text-xl font-semibold text-red-600">ログアウト</h2>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MenuGrid;
