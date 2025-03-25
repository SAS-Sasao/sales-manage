import axios from 'axios';

const API_URL = 'http://localhost:4321/api';

// 得意先マスタの型定義
export interface Customer {
  id?: number;
  customer_code: string;
  customer_name: string;
  department_name?: string;
  honorific: string;
  postal_code?: string;
  address1?: string;
  address2?: string;
  phone_number?: string;
  fax_number?: string;
  email?: string;
  invoice_number?: string;
  invoice_issuance: string;
  invoice_method?: string;
  closing_day?: string;
  payment_day?: string;
  payment_site_day?: string;
  tax_processing: string;
  tax_rounding: string;
  staff_id?: number;
  wo_special_code?: string;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

// 得意先一覧の取得
export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error('得意先一覧の取得に失敗しました:', error);
    throw error;
  }
};

// 得意先の取得（ID指定）
export const getCustomerById = async (id: number): Promise<Customer> => {
  try {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`得意先(ID: ${id})の取得に失敗しました:`, error);
    throw error;
  }
};

// 得意先の取得（コード指定）
export const getCustomerByCode = async (code: string): Promise<Customer> => {
  try {
    const response = await axios.get(`${API_URL}/customers/code/${code}`);
    return response.data;
  } catch (error) {
    console.error(`得意先(コード: ${code})の取得に失敗しました:`, error);
    throw error;
  }
};

// 得意先の作成
export const createCustomer = async (customer: Customer, userId: string): Promise<Customer> => {
  try {
    // 作成者情報を追加
    const customerWithCreator = {
      ...customer,
      created_by: userId,
      updated_by: userId
    };
    
    const response = await axios.post(`${API_URL}/customers`, customerWithCreator);
    return response.data;
  } catch (error) {
    console.error('得意先の作成に失敗しました:', error);
    throw error;
  }
};

// 得意先の更新
export const updateCustomer = async (id: number, customer: Customer, userId: string): Promise<Customer> => {
  try {
    // 更新者情報を追加
    const customerWithUpdater = {
      ...customer,
      updated_by: userId
    };
    
    const response = await axios.put(`${API_URL}/customers/${id}`, customerWithUpdater);
    return response.data;
  } catch (error) {
    console.error(`得意先(ID: ${id})の更新に失敗しました:`, error);
    throw error;
  }
};

// 得意先の削除
export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/customers/${id}`);
  } catch (error) {
    console.error(`得意先(ID: ${id})の削除に失敗しました:`, error);
    throw error;
  }
};

// 郵便番号から住所を取得（外部API利用）
export const getAddressByPostalCode = async (postalCode: string): Promise<{ address1: string }> => {
  try {
    // 郵便番号APIを利用（例: 郵便番号検索API）
    const response = await axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`);
    
    if (response.data.results && response.data.results.length > 0) {
      const result = response.data.results[0];
      const address1 = `${result.address1}${result.address2}${result.address3}`;
      return { address1 };
    }
    
    throw new Error('住所が見つかりませんでした');
  } catch (error) {
    console.error(`郵便番号(${postalCode})からの住所取得に失敗しました:`, error);
    throw error;
  }
};
