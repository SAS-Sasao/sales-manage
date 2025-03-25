import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface HeaderProps {
  currentPage?: string;
  parentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage, parentPage }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const currentTime = new Date().toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout();
      navigate('/login');
    }
  };

  // 表示するタイトルを決定
  // メニュー画面の場合は「ケミカル同仁基幹システム」を表示
  // 個別画面の場合は画面名を表示
  const displayTitle = currentPage === 'メニュー' || !currentPage 
    ? 'ケミカル同仁基幹システム' 
    : currentPage;

  return (
    <header className="bg-indigo-700 text-white py-2">
      <div className="flex justify-between items-center px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">{displayTitle}</h1>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          {currentUser && <div>ユーザーID: {currentUser.userId}</div>}
          <div>ログイン日時: {currentDate} {currentTime}</div>
          <button 
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            onClick={handleLogout}
          >
            業務終了
          </button>
        </div>
      </div>
      <div className="bg-blue-600 mt-2 py-1 px-4 flex items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-white flex items-center hover:underline">
            <span className="mr-1">🏠</span>
            <span>メニュー</span>
          </Link>
          {parentPage && currentPage !== 'メニュー' && (
            <>
              <span className="text-white mx-2">＞</span>
              <Link to="/master" className="text-white flex items-center hover:underline">
                <span className="mr-1">🔧</span>
                <span>{parentPage}</span>
              </Link>
            </>
          )}
          {currentPage && currentPage !== 'メニュー' && parentPage && (
            <>
              <span className="text-white mx-2">＞</span>
              <span className="text-white">{currentPage}</span>
            </>
          )}
          {currentPage && currentPage !== 'メニュー' && !parentPage && (
            <>
              <span className="text-white mx-2">＞</span>
              <span className="text-white">{currentPage}</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
