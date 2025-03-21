import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // 仮のユーザーデータ（実際のアプリケーションではバックエンドから取得）
  const dummyUsers = [
    { id: '00001', email: 'user1@example.com', password: 'password1' },
    { id: '00002', email: 'user2@example.com', password: 'password2' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 簡易的な認証ロジック
    const user = dummyUsers.find(u => u.id === userId && u.password === password);
    
    if (user) {
      // ログイン成功時の処理
      login({ id: user.id, email: user.email });
      navigate('/');
    } else {
      // ログイン失敗時の処理
      setError('ユーザーIDまたはパスワードが正しくありません。');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F6') {
      handleLogin(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-100" onKeyDown={handleKeyDown}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">ケミカル同仁基幹システム</h1>
        </div>
        
        <div className="bg-indigo-700 rounded-lg shadow-lg p-8">
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <label htmlFor="userId" className="block text-white w-28">ユーザーID</label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <label htmlFor="password" className="block text-white w-28">パスワード</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="mb-4 text-red-300 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
              >
                ログイン [F6]
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48"
              >
                パスワード再設定
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-indigo-300 hover:text-white text-sm"
            >
              新規ユーザー登録はこちら
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
