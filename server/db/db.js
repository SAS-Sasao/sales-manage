const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'sales_manage.db');

// データベース接続を取得
const getDb = () => {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('データベース接続エラー:', err.message);
    }
  });
};

// ユーザーIDの最大値を取得して次のIDを生成
const generateNextUserId = () => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT MAX(CAST(user_id AS INTEGER)) as maxId FROM users', [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      let nextId = 1;
      if (row && row.maxId) {
        nextId = row.maxId + 1;
      }
      
      // 5桁のゼロ埋め文字列に変換
      const nextUserId = String(nextId).padStart(5, '0');
      resolve(nextUserId);
      
      db.close();
    });
  });
};

// ユーザーをメールアドレスで検索
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(row);
      db.close();
    });
  });
};

// ユーザーをIDで検索
const findUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(row);
      db.close();
    });
  });
};

// 新しいユーザーを作成
const createUser = async (email, password) => {
  try {
    // メールアドレスの重複チェック
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に登録されています');
    }
    
    // 次のユーザーIDを生成
    const userId = await generateNextUserId();
    
    // パスワードのハッシュ化
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)',
        [userId, email, hashedPassword],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ userId, email });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// ユーザー認証
const authenticateUser = async (userId, password) => {
  try {
    const user = await findUserById(userId);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    return {
      userId: user.user_id,
      email: user.email
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDb,
  generateNextUserId,
  findUserByEmail,
  findUserById,
  createUser,
  authenticateUser
};
