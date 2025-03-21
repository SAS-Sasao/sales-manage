import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';

const CustomerMaster: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header parentPage="マスタメンテ" currentPage="得意先マスタ" />
      <main className="flex-grow overflow-auto">
        <div className="container mx-auto py-4">
          <h2 className="text-xl font-bold mb-4">得意先マスタ</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">
              得意先マスタの管理画面です。ここでは得意先情報の登録・編集・削除などが行えます。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-500">
                この画面は現在開発中です。今後、得意先データの管理機能が追加される予定です。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerMaster;
