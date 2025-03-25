import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Header from '../layout/Header';
import { 
  Customer, 
  getCustomerById, 
  createCustomer, 
  updateCustomer,
  getAddressByPostalCode
} from '../../api/customer';
import { getAllDropdownIds, getDropdownItemsById } from '../../api/dropdown';
import { getAllStaff } from '../../api/staff';

interface StaffMember {
  id: number;
  staff_code: string;
  staff_name: string;
}

const CustomerMaster: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';
  const customerId = isEditing ? parseInt(id || '0', 10) : 0;
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // 得意先データの状態
  const [customer, setCustomer] = useState<Customer>({
    customer_code: '',
    customer_name: '',
    department_name: '',
    honorific: '御中',
    postal_code: '',
    address1: '',
    address2: '',
    phone_number: '',
    fax_number: '',
    email: '',
    invoice_number: '',
    invoice_issuance: '有',
    invoice_method: '郵送',
    closing_day: '末日',
    payment_day: '翌月末日',
    payment_site_day: '',
    tax_processing: '請求書単位',
    tax_rounding: '切捨て',
    staff_id: undefined,
    wo_special_code: ''
  });
  
  // UI状態
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // プルダウン選択肢
  const [invoiceMethods, setInvoiceMethods] = useState<string[]>([]);
  const [taxProcessingOptions, setTaxProcessingOptions] = useState<string[]>([]);
  const [taxRoundingOptions, setTaxRoundingOptions] = useState<string[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  
  // 初期データの取得
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 編集モードの場合は得意先データを取得
        if (isEditing && customerId) {
          const customerData = await getCustomerById(customerId);
          setCustomer(customerData);
        }
        
        try {
          // プルダウン選択肢の取得
          const [invoiceMethodsResponse, taxProcessingResponse, taxRoundingResponse, staffData] = await Promise.all([
            getDropdownItemsById('invoice_method'),
            getDropdownItemsById('tax_processing'),
            getDropdownItemsById('tax_rounding'),
            getAllStaff()
          ]);
          
          // デフォルト値の設定
          const defaultInvoiceMethods = ['郵送', 'WEB'];
          const defaultTaxProcessing = ['請求書単位', '商品単位'];
          const defaultTaxRounding = ['切捨て', '切上げ'];
          
          // レスポンスからデータを抽出（存在しない場合はデフォルト値を使用）
          const invoiceMethodsData = invoiceMethodsResponse?.items || [];
          const taxProcessingData = taxProcessingResponse?.items || [];
          const taxRoundingData = taxRoundingResponse?.items || [];
          
          setInvoiceMethods(
            invoiceMethodsData.length > 0 
              ? invoiceMethodsData.map((item: { dropdown_value: string }) => item.dropdown_value)
              : defaultInvoiceMethods
          );
          
          setTaxProcessingOptions(
            taxProcessingData.length > 0 
              ? taxProcessingData.map((item: { dropdown_value: string }) => item.dropdown_value)
              : defaultTaxProcessing
          );
          
          setTaxRoundingOptions(
            taxRoundingData.length > 0 
              ? taxRoundingData.map((item: { dropdown_value: string }) => item.dropdown_value)
              : defaultTaxRounding
          );
          
          setStaffMembers(staffData || []);
        } catch (error) {
          console.error('プルダウン選択肢の取得エラー:', error);
          // エラー時はデフォルト値を設定
          setInvoiceMethods(['郵送', 'WEB']);
          setTaxProcessingOptions(['請求書単位', '商品単位']);
          setTaxRoundingOptions(['切捨て', '切上げ']);
          setStaffMembers([]);
        }
        
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('データの取得中にエラーが発生しました');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [isEditing, customerId]);
  
  // 入力値の変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };
  
  // 郵便番号から住所を取得
  const handlePostalCodeLookup = async () => {
    if (!customer.postal_code || customer.postal_code.length !== 7) {
      setError('郵便番号は7桁で入力してください');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { address1 } = await getAddressByPostalCode(customer.postal_code);
      
      setCustomer(prev => ({ ...prev, address1 }));
      setSuccess('住所が取得されました');
      
      // 3秒後に成功メッセージをクリア
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('住所の取得中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('ログインが必要です');
      return;
    }
    
    // 必須項目のバリデーション
    if (!customer.customer_code || !customer.customer_name || !customer.honorific || 
        !customer.invoice_issuance || !customer.tax_processing || !customer.tax_rounding) {
      setError('必須項目を入力してください');
      return;
    }
    
    // 得意先コードのバリデーション（半角数字16桁）
    if (!/^\d{1,16}$/.test(customer.customer_code)) {
      setError('得意先コードは半角数字16桁以内で入力してください');
      return;
    }
    
    // 電話番号のバリデーション（数字のみ11桁）
    if (customer.phone_number && !/^\d{1,11}$/.test(customer.phone_number)) {
      setError('電話番号は数字11桁以内で入力してください');
      return;
    }
    
    // FAX番号のバリデーション（数字のみ10桁）
    if (customer.fax_number && !/^\d{1,10}$/.test(customer.fax_number)) {
      setError('FAX番号は数字10桁以内で入力してください');
      return;
    }
    
    // メールアドレスのバリデーション
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setError('有効なメールアドレスを入力してください');
      return;
    }
    
    // インボイス番号のバリデーション（数字のみ13桁）
    if (customer.invoice_number && !/^\d{1,13}$/.test(customer.invoice_number)) {
      setError('インボイス番号は数字13桁以内で入力してください');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditing && customerId) {
        // 更新
        await updateCustomer(customerId, customer, currentUser.userId);
        setSuccess('得意先情報が更新されました');
      } else {
        // 新規作成
        await createCustomer(customer, currentUser.userId);
        setSuccess('得意先が登録されました');
        
        // 入力フォームをクリア（新規登録の場合）
        if (!isEditing) {
          setCustomer({
            customer_code: '',
            customer_name: '',
            department_name: '',
            honorific: '御中',
            postal_code: '',
            address1: '',
            address2: '',
            phone_number: '',
            fax_number: '',
            email: '',
            invoice_number: '',
            invoice_issuance: '有',
            invoice_method: '郵送',
            closing_day: '末日',
            payment_day: '翌月末日',
            payment_site_day: '',
            tax_processing: '請求書単位',
            tax_rounding: '切捨て',
            staff_id: undefined,
            wo_special_code: ''
          });
        }
      }
      
      // 3秒後に成功メッセージをクリア
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('得意先の保存中にエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // 一覧画面に遷移
  const handleGoToList = () => {
    navigate('/master/customer');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header currentPage={isEditing ? '得意先編集' : '得意先登録'} parentPage="マスタメンテ" />
      
      <main className="flex-grow container mx-auto py-6 px-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{isEditing ? '得意先編集' : '得意先登録'}</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleGoToList}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                一覧
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 得意先コード */}
              <div>
                <label className="block text-gray-700 mb-2">
                  得意先コード <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_code"
                  value={customer.customer_code}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="半角数字16桁以内"
                  maxLength={16}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">半角数字16桁以内</p>
              </div>
              
              {/* 得意先名 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  得意先名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={customer.customer_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="全角20桁以内"
                  maxLength={20}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">全角20桁以内</p>
              </div>
              
              {/* 得意先（部署・担当）名 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  得意先（部署・担当）名
                </label>
                <input
                  type="text"
                  name="department_name"
                  value={customer.department_name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="全角20桁以内"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">全角20桁以内</p>
              </div>
              
              {/* 敬称 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  敬称 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="honorific"
                      value="御中"
                      checked={customer.honorific === '御中'}
                      onChange={handleChange}
                      className="form-radio"
                      required
                    />
                    <span className="ml-2">御中</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="honorific"
                      value="様"
                      checked={customer.honorific === '様'}
                      onChange={handleChange}
                      className="form-radio"
                      required
                    />
                    <span className="ml-2">様</span>
                  </label>
                </div>
              </div>
              
              {/* 郵便番号 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  郵便番号
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="postal_code"
                    value={customer.postal_code || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="半角数字7桁"
                    maxLength={7}
                  />
                  <button
                    type="button"
                    onClick={handlePostalCodeLookup}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    disabled={loading}
                  >
                    住所検索
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">半角数字7桁</p>
              </div>
              
              {/* 住所1 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  住所1
                </label>
                <input
                  type="text"
                  name="address1"
                  value={customer.address1 || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="全角20桁以内"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">全角20桁以内</p>
              </div>
              
              {/* 住所2 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  住所2
                </label>
                <input
                  type="text"
                  name="address2"
                  value={customer.address2 || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="全角20桁以内"
                  maxLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">全角20桁以内</p>
              </div>
              
              {/* 電話番号 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  電話番号
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={customer.phone_number || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="半角数字11桁以内"
                  maxLength={11}
                />
                <p className="text-xs text-gray-500 mt-1">半角数字11桁以内</p>
              </div>
              
              {/* FAX番号 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  FAX番号
                </label>
                <input
                  type="text"
                  name="fax_number"
                  value={customer.fax_number || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="半角数字10桁以内"
                  maxLength={10}
                />
                <p className="text-xs text-gray-500 mt-1">半角数字10桁以内</p>
              </div>
              
              {/* メールアドレス */}
              <div>
                <label className="block text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  name="email"
                  value={customer.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="半角英数字記号254桁以内"
                  maxLength={254}
                />
                <p className="text-xs text-gray-500 mt-1">半角英数字記号254桁以内</p>
              </div>
              
              {/* 通信者番号（インボイス番号） */}
              <div>
                <label className="block text-gray-700 mb-2">
                  通信者番号（インボイス番号）
                </label>
                <input
                  type="text"
                  name="invoice_number"
                  value={customer.invoice_number || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="半角数字13桁以内"
                  maxLength={13}
                />
                <p className="text-xs text-gray-500 mt-1">半角数字13桁以内</p>
              </div>
              
              {/* 請求書発行区分 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  請求書発行区分 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="invoice_issuance"
                      value="有"
                      checked={customer.invoice_issuance === '有'}
                      onChange={handleChange}
                      className="form-radio"
                      required
                    />
                    <span className="ml-2">有</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="invoice_issuance"
                      value="無"
                      checked={customer.invoice_issuance === '無'}
                      onChange={handleChange}
                      className="form-radio"
                      required
                    />
                    <span className="ml-2">無</span>
                  </label>
                </div>
              </div>
              
              {/* 請求書発行方法 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  請求書発行方法
                </label>
                <select
                  name="invoice_method"
                  value={customer.invoice_method || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">選択してください</option>
                  {invoiceMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 締め日 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  締め日
                </label>
                <div className="flex space-x-2 items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="closing_day"
                      value="末日"
                      checked={customer.closing_day === '末日'}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">末日</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="closing_day"
                      value="指定日"
                      checked={customer.closing_day !== '末日' && customer.closing_day !== ''}
                      onChange={() => setCustomer(prev => ({ ...prev, closing_day: '15' }))}
                      className="form-radio"
                    />
                    <span className="ml-2">指定日</span>
                  </label>
                  {customer.closing_day !== '末日' && customer.closing_day !== '' && (
                    <input
                      type="text"
                      name="closing_day"
                      value={customer.closing_day}
                      onChange={handleChange}
                      className="w-16 p-2 border border-gray-300 rounded"
                      placeholder="日"
                      maxLength={2}
                    />
                  )}
                  <span>日</span>
                </div>
              </div>
              
              {/* 支払日 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  支払日
                </label>
                <div className="flex space-x-2 items-center">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="payment_day"
                      value="翌月末日"
                      checked={customer.payment_day === '翌月末日'}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">翌月末日</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="payment_day"
                      value="指定日"
                      checked={customer.payment_day !== '翌月末日' && customer.payment_day !== ''}
                      onChange={() => setCustomer(prev => ({ ...prev, payment_day: '15' }))}
                      className="form-radio"
                    />
                    <span className="ml-2">指定日</span>
                  </label>
                  {customer.payment_day !== '翌月末日' && customer.payment_day !== '' && (
                    <input
                      type="text"
                      name="payment_day"
                      value={customer.payment_day}
                      onChange={handleChange}
                      className="w-16 p-2 border border-gray-300 rounded"
                      placeholder="日"
                      maxLength={2}
                    />
                  )}
                  <span>日</span>
                </div>
              </div>
              
              {/* サイト支払日 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  サイト支払日
                </label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="text"
                    name="payment_site_day"
                    value={customer.payment_site_day || ''}
                    onChange={handleChange}
                    className="w-16 p-2 border border-gray-300 rounded"
                    placeholder="日数"
                    maxLength={3}
                  />
                  <span>日後</span>
                </div>
              </div>
              
              {/* 消費税処理区分 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  消費税処理区分 <span className="text-red-500">*</span>
                </label>
                <select
                  name="tax_processing"
                  value={customer.tax_processing}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">選択してください</option>
                  {taxProcessingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 消費税端数処理区分 */}
              <div>
                <label className="block text-gray-700 mb-2">
                  消費税端数処理区分 <span className="text-red-500">*</span>
                </label>
                <select
                  name="tax_rounding"
                  value={customer.tax_rounding}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">選択してください</option>
                  {taxRoundingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 担当者（自社） */}
              <div>
                <label className="block text-gray-700 mb-2">
                  担当者（自社）
                </label>
                <select
                  name="staff_id"
                  value={customer.staff_id || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">選択してください</option>
                  {staffMembers.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.staff_name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* WO用特殊コード */}
              <div>
                <label className="block text-gray-700 mb-2">
                  WO用特殊コード
                </label>
                <input
                  type="text"
                  name="wo_special_code"
                  value={customer.wo_special_code || ''}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="任意入力"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? '処理中...' : isEditing ? '更新' : '登録'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/master')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                戻る
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CustomerMaster;
