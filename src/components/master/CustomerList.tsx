import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Header from '../layout/Header';
import { Customer, getAllCustomers, deleteCustomer } from '../../api/customer';

const CustomerList: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Customer>('customer_code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // 得意先一覧の取得
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('得意先一覧の取得中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // 初回レンダリング時に得意先一覧を取得
  useEffect(() => {
    fetchCustomers();
  }, []);

  // 得意先の削除
  const handleDelete = async (id: number) => {
    if (!window.confirm('この得意先を削除してもよろしいですか？')) {
      return;
    }

    try {
      setLoading(true);
      await deleteCustomer(id);
      // 得意先一覧を再取得
      await fetchCustomers();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('得意先の削除中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // ソート処理
  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      // 同じフィールドの場合は昇順/降順を切り替え
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 異なるフィールドの場合は昇順でソート
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 検索とソートを適用した得意先一覧
  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const searchLower = searchTerm.toLowerCase();
      return (
        customer.customer_code.toLowerCase().includes(searchLower) ||
        customer.customer_name.toLowerCase().includes(searchLower) ||
        (customer.department_name && customer.department_name.toLowerCase().includes(searchLower)) ||
        (customer.phone_number && customer.phone_number.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // 数値や日付の場合
      return sortDirection === 'asc'
        ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0)
        : (bValue < aValue ? -1 : bValue > aValue ? 1 : 0);
    });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage="得意先一覧" parentPage="マスタメンテ" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">得意先一覧</h2>
            <div className="flex space-x-2">
              <Link
                to="/master/customer/new"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                新規登録
              </Link>
              <button
                onClick={() => navigate('/master')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                戻る
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <p>読み込み中...</p>
            </div>
          ) : filteredAndSortedCustomers.length === 0 ? (
            <div className="text-center py-4">
              <p>得意先が登録されていません</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('customer_code')}>
                      得意先コード
                      {sortField === 'customer_code' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('customer_name')}>
                      得意先名
                      {sortField === 'customer_name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('department_name')}>
                      部署・担当名
                      {sortField === 'department_name' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="py-2 px-4 border cursor-pointer" onClick={() => handleSort('phone_number')}>
                      電話番号
                      {sortField === 'phone_number' && (
                        <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th className="py-2 px-4 border">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">{customer.customer_code}</td>
                      <td className="py-2 px-4 border">{customer.customer_name}</td>
                      <td className="py-2 px-4 border">{customer.department_name || '-'}</td>
                      <td className="py-2 px-4 border">{customer.phone_number || '-'}</td>
                      <td className="py-2 px-4 border">
                        <div className="flex space-x-2">
                          <Link
                            to={`/master/customer/${customer.id}`}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            詳細
                          </Link>
                          <Link
                            to={`/master/customer/edit/${customer.id}`}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => customer.id && handleDelete(customer.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerList;
