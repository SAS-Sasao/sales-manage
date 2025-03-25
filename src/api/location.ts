// 拠点マスタ関連のAPI呼び出しを行うモジュール

const API_URL = 'http://localhost:4322/api';

export interface Location {
  id?: number;
  location_code: string;
  location_name: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

// 全ての拠点を取得
export const getAllLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetch(`${API_URL}/locations`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '拠点の取得に失敗しました');
    }

    return data.locations;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('拠点の取得中に予期せぬエラーが発生しました');
  }
};

// 拠点をコードで取得
export const getLocationByCode = async (locationCode: string): Promise<Location> => {
  try {
    const response = await fetch(`${API_URL}/locations/${locationCode}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '拠点の取得に失敗しました');
    }

    return data.location;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('拠点の取得中に予期せぬエラーが発生しました');
  }
};

// 新しい拠点を作成
export const createLocation = async (
  locationName: string,
  userId: string
): Promise<Location> => {
  try {
    const response = await fetch(`${API_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locationName, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '拠点の作成に失敗しました');
    }

    return data.location;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('拠点の作成中に予期せぬエラーが発生しました');
  }
};

// 拠点を更新
export const updateLocation = async (
  locationCode: string,
  locationName: string,
  userId: string
): Promise<Location> => {
  try {
    const response = await fetch(`${API_URL}/locations/${locationCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locationName, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '拠点の更新に失敗しました');
    }

    return data.location;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('拠点の更新中に予期せぬエラーが発生しました');
  }
};

// 拠点を削除
export const deleteLocation = async (locationCode: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/locations/${locationCode}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '拠点の削除に失敗しました');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('拠点の削除中に予期せぬエラーが発生しました');
  }
};
