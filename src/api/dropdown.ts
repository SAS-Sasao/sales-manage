// プルダウン項目マスタ関連のAPI呼び出しを行うモジュール

const API_URL = 'http://localhost:4321/api';

export interface DropdownItem {
  id?: number;
  dropdown_id: string;
  dropdown_value: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

// 全てのプルダウンIDを取得
export const getAllDropdownIds = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/dropdown/ids`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'プルダウンIDの取得に失敗しました');
    }

    return data.dropdownIds;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('プルダウンIDの取得中に予期せぬエラーが発生しました');
  }
};

// 特定のプルダウンIDに関連する全ての項目を取得
export const getDropdownItemsById = async (dropdownId: string): Promise<DropdownItem[]> => {
  try {
    const response = await fetch(`${API_URL}/dropdown/items/${dropdownId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'プルダウン項目の取得に失敗しました');
    }

    return data.items;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('プルダウン項目の取得中に予期せぬエラーが発生しました');
  }
};

// 全てのプルダウン項目を取得
export const getAllDropdownItems = async (): Promise<DropdownItem[]> => {
  try {
    const response = await fetch(`${API_URL}/dropdown/items`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'プルダウン項目の取得に失敗しました');
    }

    return data.items;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('プルダウン項目の取得中に予期せぬエラーが発生しました');
  }
};

// 新しいプルダウン項目を作成
export const createDropdownItem = async (
  dropdownId: string,
  dropdownValue: string,
  userId: string
): Promise<DropdownItem> => {
  try {
    const response = await fetch(`${API_URL}/dropdown/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dropdownId, dropdownValue, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'プルダウン項目の作成に失敗しました');
    }

    return data.item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('プルダウン項目の作成中に予期せぬエラーが発生しました');
  }
};

// プルダウン項目を更新
export const updateDropdownItem = async (
  id: number,
  dropdownId: string,
  dropdownValue: string,
  userId: string
): Promise<DropdownItem> => {
  try {
    const response = await fetch(`${API_URL}/dropdown/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dropdownId, dropdownValue, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'プルダウン項目の更新に失敗しました');
    }

    return data.item;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('プルダウン項目の更新中に予期せぬエラーが発生しました');
  }
};

// プルダウン項目を削除
export const deleteDropdownItem = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/dropdown/items/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'プルダウン項目の削除に失敗しました');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('プルダウン項目の削除中に予期せぬエラーが発生しました');
  }
};

// プルダウンIDに関連する全ての項目を削除
export const deleteDropdownItemsById = async (dropdownId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/dropdown/items/by-id/${dropdownId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'プルダウン項目の削除に失敗しました');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('プルダウン項目の削除中に予期せぬエラーが発生しました');
  }
};
