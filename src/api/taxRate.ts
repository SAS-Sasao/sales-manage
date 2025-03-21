// 税率マスタ関連のAPI呼び出しを行うモジュール

const API_URL = 'http://localhost:4322/api';

export interface TaxRate {
  id?: number;
  tax_code: string;
  tax_name: string;
  rate: number;
  calculation_type: number;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

// 全ての税率を取得
export const getAllTaxRates = async (): Promise<TaxRate[]> => {
  try {
    const response = await fetch(`${API_URL}/tax-rates`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '税率の取得に失敗しました');
    }

    return data.taxRates;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('税率の取得中に予期せぬエラーが発生しました');
  }
};

// 税率をコードで取得
export const getTaxRateByCode = async (taxCode: string): Promise<TaxRate> => {
  try {
    const response = await fetch(`${API_URL}/tax-rates/${taxCode}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '税率の取得に失敗しました');
    }

    return data.taxRate;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('税率の取得中に予期せぬエラーが発生しました');
  }
};

// 新しい税率を作成
export const createTaxRate = async (
  taxName: string,
  rate: number,
  calculationType: number,
  userId: string
): Promise<TaxRate> => {
  try {
    const response = await fetch(`${API_URL}/tax-rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taxName, rate, calculationType, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '税率の作成に失敗しました');
    }

    return data.taxRate;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('税率の作成中に予期せぬエラーが発生しました');
  }
};

// 税率を更新
export const updateTaxRate = async (
  taxCode: string,
  taxName: string,
  rate: number,
  calculationType: number,
  userId: string
): Promise<TaxRate> => {
  try {
    const response = await fetch(`${API_URL}/tax-rates/${taxCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taxName, rate, calculationType, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '税率の更新に失敗しました');
    }

    return data.taxRate;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('税率の更新中に予期せぬエラーが発生しました');
  }
};

// 税率を削除
export const deleteTaxRate = async (taxCode: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/tax-rates/${taxCode}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '税率の削除に失敗しました');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('税率の削除中に予期せぬエラーが発生しました');
  }
};

// 計算区分の表示名を取得
export const getCalculationTypeName = (calculationType: number): string => {
  switch (calculationType) {
    case 1:
      return '切り捨て';
    case 2:
      return '切り上げ';
    case 3:
      return '四捨五入';
    default:
      return '不明';
  }
};
