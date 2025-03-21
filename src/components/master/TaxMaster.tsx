import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Header from '../layout/Header';
import { 
  TaxRate, 
  getAllTaxRates, 
  createTaxRate, 
  updateTaxRate, 
  deleteTaxRate,
  getCalculationTypeName
} from '../../api/taxRate';

const TaxMaster: React.FC = () => {
  const { currentUser } = useAuth();
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaxName, setNewTaxName] = useState<string>('');
  const [newTaxRate, setNewTaxRate] = useState<string>('');
  const [newCalculationType, setNewCalculationType] = useState<string>('3'); // デフォルトは四捨五入
  const [editingTaxCode, setEditingTaxCode] = useState<string | null>(null);
  const [editTaxName, setEditTaxName] = useState<string>('');
  const [editTaxRate, setEditTaxRate] = useState<string>('');
  const [editCalculationType, setEditCalculationType] = useState<string>('');

  // 税率データの取得
  const fetchTaxRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTaxRates();
      setTaxRates(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('税率データの取得中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 初回レンダリング時にデータを取得
  useEffect(() => {
    fetchTaxRates();
  }, []);

  // 新しい税率の登録
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaxName || !newTaxRate || !newCalculationType) {
      setError('すべての項目を入力してください');
      return;
    }
    
    if (!currentUser) {
      setError('ログインが必要です');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await createTaxRate(
        newTaxName,
        parseFloat(newTaxRate),
        parseInt(newCalculationType, 10),
        currentUser.userId
      );
      
      // 入力フィールドをクリア
      setNewTaxName('');
      setNewTaxRate('');
      setNewCalculationType('3');
      
      // 税率データを再取得
      await fetchTaxRates();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('税率の登録中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 編集モードの開始
  const handleEdit = (taxRate: TaxRate) => {
    setEditingTaxCode(taxRate.tax_code);
    setEditTaxName(taxRate.tax_name);
    setEditTaxRate(taxRate.rate.toString());
    setEditCalculationType(taxRate.calculation_type.toString());
  };

  // 税率の更新
  const handleUpdate = async (taxCode: string) => {
    if (!editTaxName || !editTaxRate || !editCalculationType) {
      setError('すべての項目を入力してください');
      return;
    }
    
    if (!currentUser) {
      setError('ログインが必要です');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await updateTaxRate(
        taxCode,
        editTaxName,
        parseFloat(editTaxRate),
        parseInt(editCalculationType, 10),
        currentUser.userId
      );
      
      // 編集モードを終了
      setEditingTaxCode(null);
      
      // 税率データを再取得
      await fetchTaxRates();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('税率の更新中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 税率の削除
  const handleDelete = async (taxCode: string) => {
    if (!window.confirm('この税率を削除してもよろしいですか？')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await deleteTaxRate(taxCode);
      
      // 税率データを再取得
      await fetchTaxRates();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('税率の削除中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 編集のキャンセル
  const handleCancelEdit = () => {
    setEditingTaxCode(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage="税率マスタ" parentPage="マスタメンテ" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 左側: 税率登録フォーム */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">登録内容</h2>
            
            <form onSubmit={handleRegister} className="mb-6">
              <div className="mb-4">
                <label htmlFor="taxName" className="block text-gray-700 mb-2">税率</label>
                <input
                  type="text"
                  id="taxName"
                  value={newTaxName}
                  onChange={(e) => setNewTaxName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="例: 10%"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="taxRate" className="block text-gray-700 mb-2">税率値</label>
                <input
                  type="number"
                  id="taxRate"
                  value={newTaxRate}
                  onChange={(e) => setNewTaxRate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="例: 10"
                  step="0.1"
                  min="0"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="calculationType" className="block text-gray-700 mb-2">計算区分</label>
                <select
                  id="calculationType"
                  value={newCalculationType}
                  onChange={(e) => setNewCalculationType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="1">切り捨て</option>
                  <option value="2">切り上げ</option>
                  <option value="3">四捨五入</option>
                </select>
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
          
          {/* 右側: 税率一覧 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">登録税率一覧</h2>
            
            {loading && <p className="text-center">読み込み中...</p>}
            
            {!loading && taxRates.length === 0 && (
              <p className="text-center">登録されている税率はありません</p>
            )}
            
            {!loading && taxRates.length > 0 && (
              <div className="space-y-4">
                {taxRates.map((taxRate) => (
                  <div key={taxRate.tax_code} className="border rounded p-4">
                    {editingTaxCode === taxRate.tax_code ? (
                      // 編集モード
                      <div>
                        <div className="mb-2">
                          <label className="block text-gray-700 mb-1">税率</label>
                          <input
                            type="text"
                            value={editTaxName}
                            onChange={(e) => setEditTaxName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        
                        <div className="mb-2">
                          <label className="block text-gray-700 mb-1">税率値</label>
                          <input
                            type="number"
                            value={editTaxRate}
                            onChange={(e) => setEditTaxRate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            step="0.1"
                            min="0"
                          />
                        </div>
                        
                        <div className="mb-2">
                          <label className="block text-gray-700 mb-1">計算区分</label>
                          <select
                            value={editCalculationType}
                            onChange={(e) => setEditCalculationType(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                          >
                            <option value="1">切り捨て</option>
                            <option value="2">切り上げ</option>
                            <option value="3">四捨五入</option>
                          </select>
                        </div>
                        
                        <div className="flex justify-between mt-2">
                          <button
                            onClick={() => handleUpdate(taxRate.tax_code)}
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
                          <div className="font-semibold text-lg">{taxRate.tax_name}</div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(taxRate)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                              修正
                            </button>
                            <button
                              onClick={() => handleDelete(taxRate.tax_code)}
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>税率コード: {taxRate.tax_code}</div>
                          <div>税率値: {taxRate.rate}%</div>
                          <div>計算区分: {getCalculationTypeName(taxRate.calculation_type)}</div>
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

export default TaxMaster;
