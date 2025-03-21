import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';

const LocationMaster: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <main className="flex-grow overflow-auto">
        <div className="container mx-auto py-4">
          <div className="flex items-center mb-4">
            <Link to="/master" className="text-blue-500 hover:text-blue-700 flex items-center">
              <span className="mr-2">←</span>
              <span>マスタメンテメニューに戻る</span>
            </Link>
          </div>
          <h2 className="text-xl font-bold mb-4">拠点マスタ</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700">
              拠点マスタの管理画面です。ここでは拠点情報の登録・編集・削除などが行えます。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm text-gray-500">
                この画面は現在開発中です。今後、拠点データの管理機能が追加される予定です。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationMaster;
