// 認証関連のAPI呼び出しを行うモジュール

const API_URL = 'http://localhost:4321/api';

// ユーザー登録
export const registerUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || '登録に失敗しました');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('登録中に予期せぬエラーが発生しました');
  }
};

// ログイン
export const loginUser = async (userId: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'ログインに失敗しました');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('ログイン中に予期せぬエラーが発生しました');
  }
};
