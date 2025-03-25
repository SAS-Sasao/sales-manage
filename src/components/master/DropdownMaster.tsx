import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import Header from '../layout/Header';
import { 
  DropdownItem, 
  getAllDropdownIds, 
  getDropdownItemsById, 
  createDropdownItem, 
  updateDropdownItem, 
  deleteDropdownItem,
  deleteDropdownItemsById
} from '../../api/dropdown';

const DropdownMaster: React.FC = () => {
  const { currentUser } = useAuth();
  const [dropdownIds, setDropdownIds] = useState<string[]>([]);
  const [dropdownItems, setDropdownItems] = useState<DropdownItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 新規登録用の状態
  const [newDropdownId, setNewDropdownId] = useState<string>('');
  const [newDropdownValues, setNewDropdownValues] = useState<string[]>(Array(10).fill(''));
  
  // 編集用の状態
  const [selectedDropdownId, setSelectedDropdownId] = useState<string>('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editDropdownValue, setEditDropdownValue] = useState<string>('');

  // プルダウンIDの取得
  const fetchDropdownIds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDropdownIds();
      setDropdownIds(data);
      
      // 初期選択
      if (data.length > 0 && !selectedDropdownId) {
        setSelectedDropdownId(data[0]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('プルダウンIDの取得中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 特定のプルダウンIDに関連する項目の取得
  const fetchDropdownItems = async (dropdownId: string) => {
    if (!dropdownId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getDropdownItemsById(dropdownId);
      setDropdownItems(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('プルダウン項目の取得中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 初回レンダリング時にプルダウンIDを取得
  useEffect(() => {
    fetchDropdownIds();
  }, []);

  // 選択されたプルダウンIDが変更されたら、関連する項目を取得
  useEffect(() => {
    if (selectedDropdownId) {
      fetchDropdownItems(selectedDropdownId);
    }
  }, [selectedDropdownId]);

  // 新しいプルダウン項目の登録
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDropdownId) {
      setError('プルダウンIDを入力してください');
      return;
    }
    
    if (!currentUser) {
      setError('ログインが必要です');
      return;
    }
    
    // 空でない値のみをフィルタリング
    const validValues = newDropdownValues.filter(value => value.trim() !== '');
    
    if (validValues.length === 0) {
      setError('少なくとも1つのプルダウン値を入力してください');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // 各値を登録
      for (const value of validValues) {
        await createDropdownItem(newDropdownId, value, currentUser.userId);
      }
      
      // 入力フィールドをクリア
      setNewDropdownId('');
      setNewDropdownValues(Array(10).fill(''));
      
      // プルダウンIDを再取得
      await fetchDropdownIds();
      
      // 新しく作成したプルダウンIDを選択
      setSelectedDropdownId(newDropdownId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('プルダウン項目の登録中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 編集モードの開始
  const handleEdit = (item: DropdownItem) => {
    if (item.id !== undefined) {
      setEditingItemId(item.id);
      setEditDropdownValue(item.dropdown_value);
    } else {
      setError('項目IDが不明です');
    }
  };

  // プルダウン項目の更新
  const handleUpdate = async (item: DropdownItem) => {
    if (!editDropdownValue) {
      setError('プルダウン値を入力してください');
      return;
    }
    
    if (!currentUser || item.id === undefined) {
      setError('ログインが必要です');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await updateDropdownItem(
        item.id,
        item.dropdown_id,
        editDropdownValue,
        currentUser.userId
      );
      
      // 編集モードを終了
      setEditingItemId(null);
      
      // プルダウン項目を再取得
      await fetchDropdownItems(selectedDropdownId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('プルダウン項目の更新中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // プルダウン項目の削除
  const handleDelete = async (item: DropdownItem) => {
    if (!window.confirm('このプルダウン項目を削除してもよろしいですか？')) {
      return;
    }
    
    if (item.id === undefined) {
      setError('項目IDが不明です');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await deleteDropdownItem(item.id);
      
      // プルダウン項目を再取得
      await fetchDropdownItems(selectedDropdownId);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('プルダウン項目の削除中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // プルダウンIDに関連する全ての項目を削除
  const handleDeleteAll = async () => {
    if (!selectedDropdownId) {
      setError('プルダウンIDが選択されていません');
      return;
    }
    
    if (!window.confirm(`プルダウンID "${selectedDropdownId}" に関連する全ての項目を削除してもよろしいですか？`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await deleteDropdownItemsById(selectedDropdownId);
      
      // プルダウン項目を再取得
      await fetchDropdownItems(selectedDropdownId);
      
      // プルダウンIDを再取得（削除によって空になった場合に備えて）
      await fetchDropdownIds();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('プルダウン項目の削除中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 編集のキャンセル
  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  // 新規プルダウン値の入力フィールドを追加
  const handleAddValueField = () => {
    setNewDropdownValues([...newDropdownValues, '']);
  };

  // 新規プルダウン値の入力フィールドの値を更新
  const handleChangeDropdownValue = (index: number, value: string) => {
    const updatedValues = [...newDropdownValues];
    updatedValues[index] = value;
    setNewDropdownValues(updatedValues);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage="プルダウン項目マスタ" parentPage="マスタメンテ" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左側: プルダウン項目登録フォーム */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">登録内容</h2>
            
            <form onSubmit={handleRegister} className="mb-6">
              <div className="mb-4">
                <label htmlFor="dropdownId" className="block text-gray-700 mb-2">プルダウンID</label>
                <input
                  type="text"
                  id="dropdownId"
                  value={newDropdownId}
                  onChange={(e) => setNewDropdownId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="例: payment_method"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">プルダウン値（複数設定可能）</label>
                {newDropdownValues.map((value, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleChangeDropdownValue(index, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder={`プルダウン値 ${index + 1}`}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddValueField}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  + 項目を追加
                </button>
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
          
          {/* 右側: プルダウン項目一覧 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label htmlFor="selectedDropdownId" className="block text-gray-700 mb-2">プルダウンID選択</label>
              <select
                id="selectedDropdownId"
                value={selectedDropdownId}
                onChange={(e) => setSelectedDropdownId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {dropdownIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">登録プルダウン項目一覧</h2>
            
            {loading && <p className="text-center">読み込み中...</p>}
            
            {!loading && dropdownItems.length === 0 && (
              <p className="text-center">登録されているプルダウン項目はありません</p>
            )}
            
            {!loading && dropdownItems.length > 0 && (
              <div className="space-y-4">
                {dropdownItems.map((item) => (
                  <div key={item.id} className="border rounded p-4">
                    {editingItemId === item.id ? (
                      // 編集モード
                      <div>
                        <div className="mb-2">
                          <label className="block text-gray-700 mb-1">プルダウン値</label>
                          <input
                            type="text"
                            value={editDropdownValue}
                            onChange={(e) => setEditDropdownValue(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => handleUpdate(item)}
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
                          <div className="font-semibold text-lg">{item.dropdown_value}</div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              修正
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {selectedDropdownId && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleDeleteAll}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  disabled={loading || dropdownItems.length === 0}
                >
                  全て削除
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DropdownMaster;
