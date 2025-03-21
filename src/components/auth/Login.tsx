import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, error: authError, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(userId, password);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('ログインに失敗しました');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F6') {
      handleLogin(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" onKeyDown={handleKeyDown}>
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
            
            {(error || authError) && (
              <div className="mb-4 text-red-300 text-sm text-center">
                {error || authError}
              </div>
            )}
            
            <div className="flex justify-between space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
                disabled={isLoading}
              >
                {isLoading ? 'ログイン中...' : 'ログイン [F6]'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
                disabled={isLoading}
              >
                パスワード再設定
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/register')}
              className="text-indigo-300 hover:text-white text-sm"
              disabled={isLoading}
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
