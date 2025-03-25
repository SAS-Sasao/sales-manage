import axios from 'axios';

const API_URL = 'http://localhost:4322/api';

// 担当者マスタの型定義
export interface StaffMember {
  id: number;
  staff_code: string;
  staff_name: string;
  email?: string;
  department?: string;
  position?: string;
  phone_number?: string;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
}

// 担当者一覧の取得
export const getAllStaff = async (): Promise<StaffMember[]> => {
  try {
    const response = await axios.get(`${API_URL}/staff`);
    return response.data;
  } catch (error) {
    console.error('担当者一覧の取得に失敗しました:', error);
    throw error;
  }
};

// 担当者の取得（ID指定）
export const getStaffById = async (id: number): Promise<StaffMember> => {
  try {
    const response = await axios.get(`${API_URL}/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error(`担当者(ID: ${id})の取得に失敗しました:`, error);
    throw error;
  }
};

// 担当者の取得（コード指定）
export const getStaffByCode = async (code: string): Promise<StaffMember> => {
  try {
    const response = await axios.get(`${API_URL}/staff/code/${code}`);
    return response.data;
  } catch (error) {
    console.error(`担当者(コード: ${code})の取得に失敗しました:`, error);
    throw error;
  }
};

// 担当者の作成
export const createStaff = async (staff: StaffMember, userId: string): Promise<StaffMember> => {
  try {
    // 作成者情報を追加
    const staffWithCreator = {
      ...staff,
      created_by: userId,
      updated_by: userId
    };
    
    const response = await axios.post(`${API_URL}/staff`, staffWithCreator);
    return response.data;
  } catch (error) {
    console.error('担当者の作成に失敗しました:', error);
    throw error;
  }
};

// 担当者の更新
export const updateStaff = async (id: number, staff: StaffMember, userId: string): Promise<StaffMember> => {
  try {
    // 更新者情報を追加
    const staffWithUpdater = {
      ...staff,
      updated_by: userId
    };
    
    const response = await axios.put(`${API_URL}/staff/${id}`, staffWithUpdater);
    return response.data;
  } catch (error) {
    console.error(`担当者(ID: ${id})の更新に失敗しました:`, error);
    throw error;
  }
};

// 担当者の削除
export const deleteStaff = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/staff/${id}`);
  } catch (error) {
    console.error(`担当者(ID: ${id})の削除に失敗しました:`, error);
    throw error;
  }
};
