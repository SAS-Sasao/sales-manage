import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';

const MenuGrid: React.FC = () => {
  // 開発中メッセージを表示する関数
  const showDevelopmentMessage = (featureName: string) => {
    window.alert(`${featureName}機能は現在開発中です`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage="メニュー" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 機能選択 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('機能選択')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">📋</span>
              <h2 className="text-xl font-semibold">機能選択</h2>
            </div>
          </div>
          
          {/* 受注管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('受注管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">🚢</span>
              <h2 className="text-xl font-semibold">受注管理</h2>
            </div>
          </div>
          
          {/* 出荷管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('出荷管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">🚚</span>
              <h2 className="text-xl font-semibold">出荷管理</h2>
            </div>
          </div>
          
          {/* 請求管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('請求管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">💰</span>
              <h2 className="text-xl font-semibold">請求管理</h2>
            </div>
          </div>
          
          {/* 入荷管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('入荷管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">📦</span>
              <h2 className="text-xl font-semibold">入荷管理</h2>
            </div>
          </div>
          
          {/* 支払管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('支払管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">💳</span>
              <h2 className="text-xl font-semibold">支払管理</h2>
            </div>
          </div>
          
          {/* マスタメンテ */}
          <Link to="/master" className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🔧</span>
              <h2 className="text-xl font-semibold">マスタメンテ</h2>
            </div>
          </Link>
          
          {/* 共通管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('共通管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">🔄</span>
              <h2 className="text-xl font-semibold">共通管理</h2>
            </div>
          </div>
          
          {/* 売上管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('売上管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">📊</span>
              <h2 className="text-xl font-semibold">売上管理</h2>
            </div>
          </div>
          
          {/* 在庫管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('在庫管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">📝</span>
              <h2 className="text-xl font-semibold">在庫管理</h2>
            </div>
          </div>
          
          {/* 問合せ管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('問合せ管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">❓</span>
              <h2 className="text-xl font-semibold">問合せ管理</h2>
            </div>
          </div>
          
          {/* システム管理 */}
          <div 
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showDevelopmentMessage('システム管理')}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">⚙️</span>
              <h2 className="text-xl font-semibold">システム管理</h2>
            </div>
          </div>
          
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
