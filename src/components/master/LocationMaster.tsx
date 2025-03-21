import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Header from '../layout/Header';
import { 
  Location, 
  getAllLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation
} from '../../api/location';

const LocationMaster: React.FC = () => {
  const { currentUser } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newLocationName, setNewLocationName] = useState<string>('');
  const [editingLocationCode, setEditingLocationCode] = useState<string | null>(null);
  const [editLocationName, setEditLocationName] = useState<string>('');

  // 拠点データの取得
  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllLocations();
      setLocations(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('拠点データの取得中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    fetchLocations();
  }, []);

  // 新しい拠点の登録
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLocationName) {
      setError('拠点名を入力してください');
      return;
    }
    
    if (!currentUser) {
      setError('ログインが必要です');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createLocation(
        newLocationName,
        currentUser.userId
      );
      
      // 入力フィールドをクリア
      setNewLocationName('');
      
      // 拠点データを再取得
      await fetchLocations();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('拠点の登録中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 編集モードの開始
  const handleEdit = (location: Location) => {
    setEditingLocationCode(location.location_code);
    setEditLocationName(location.location_name);
  };

  // 拠点の更新
  const handleUpdate = async (locationCode: string) => {
    if (!editLocationName) {
      setError('拠点名を入力してください');
      return;
    }
    
    if (!currentUser) {
      setError('ログインが必要です');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await updateLocation(
        locationCode,
        editLocationName,
        currentUser.userId
      );
      
      // 編集モードを終了
      setEditingLocationCode(null);
      
      // 拠点データを再取得
      await fetchLocations();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('拠点の更新中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 拠点の削除
  const handleDelete = async (locationCode: string) => {
    if (!window.confirm('この拠点を削除してもよろしいですか？')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await deleteLocation(locationCode);
      
      // 拠点データを再取得
      await fetchLocations();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('拠点の削除中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 編集のキャンセル
  const handleCancelEdit = () => {
    setEditingLocationCode(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage="拠点マスタ" parentPage="マスタメンテ" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左側: 拠点登録フォーム */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">登録内容</h2>
            
            <form onSubmit={handleRegister} className="mb-6">
              <div className="mb-4">
                <label htmlFor="locationName" className="block text-gray-700 mb-2">拠点名</label>
                <input
                  type="text"
                  id="locationName"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="例: 東京支店"
                  maxLength={10}
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                disabled={loading}
              >
                {loading ? '処理中...' : '登録'}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => window.history.back()}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                終了
              </button>
            </div>
          </div>
          
          {/* 右側: 拠点一覧 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">登録拠点一覧</h2>
            
            {loading && <p className="text-center">読み込み中...</p>}
            
            {!loading && locations.length === 0 && (
              <p className="text-center">登録されている拠点はありません</p>
            )}
            
            {!loading && locations.length > 0 && (
              <div className="space-y-4">
                {locations.map((location) => (
                  <div key={location.location_code} className="border rounded p-4">
                    {editingLocationCode === location.location_code ? (
                      // 編集モード
                      <div>
                        <div className="mb-2">
                          <label className="block text-gray-700 mb-1">拠点名</label>
                          <input
                            type="text"
                            value={editLocationName}
                            onChange={(e) => setEditLocationName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            maxLength={10}
                          />
                        </div>
                        
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => handleUpdate(location.location_code)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            disabled={loading}
                          >
                            修正
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 表示モード
                      <div>
                        <div className="flex justify-between items-center">
                          <div className="font-semibold text-lg">{location.location_name}</div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(location)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              修正
                            </button>
                            <button
                              onClick={() => handleDelete(location.location_code)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>拠点コード: {location.location_code}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                順序並び替え
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationMaster;
