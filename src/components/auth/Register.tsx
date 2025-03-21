import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 入力検証
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // APIを呼び出してユーザー登録
      const response = await registerUser(email, password);
      
      if (response.success) {
        setNewUserId(response.user.userId);
        setSuccess(true);
      } else {
        throw new Error(response.error || '登録に失敗しました');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('登録中に予期せぬエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">ケミカル同仁基幹システム</h1>
        </div>
        
        <div className="bg-indigo-700 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-white mb-6 text-center">新規ユーザー登録</h2>
          
          {success ? (
            <div className="text-center">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p>ユーザー登録が完了しました。</p>
                <p className="font-bold">あなたのユーザーID: {newUserId}</p>
                <p className="text-sm mt-2">このIDは忘れないようにメモしてください。</p>
              </div>
              <button
                onClick={handleBackToLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              >
                ログイン画面に戻る
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <label htmlFor="email" className="block text-white w-40">メールアドレス</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center mb-4">
                  <label htmlFor="password" className="block text-white w-40">パスワード</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center">
                  <label htmlFor="confirmPassword" className="block text-white w-40">パスワード（確認）</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {error && (
                <div className="mb-4 text-red-300 text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="flex justify-between space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
                  disabled={isLoading}
                >
                  {isLoading ? '登録中...' : '登録する'}
                </button>
                
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 w-48"
                  disabled={isLoading}
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
