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

// 税率コードの最大値を取得して次のコードを生成
const generateNextTaxCode = () => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT MAX(CAST(tax_code AS INTEGER)) as maxCode FROM tax_rates', [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      let nextCode = 1;
      if (row && row.maxCode) {
        nextCode = row.maxCode + 1;
      }
      
      // 2桁のゼロ埋め文字列に変換
      const nextTaxCode = String(nextCode).padStart(2, '0');
      resolve(nextTaxCode);
      
      db.close();
    });
  });
};

// 全ての税率を取得
const getAllTaxRates = () => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.all('SELECT * FROM tax_rates ORDER BY CAST(tax_code AS INTEGER)', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(rows);
      db.close();
    });
  });
};

// 税率をコードで検索
const findTaxRateByCode = (taxCode) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT * FROM tax_rates WHERE tax_code = ?', [taxCode], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(row);
      db.close();
    });
  });
};

// 新しい税率を作成
const createTaxRate = async (taxName, rate, calculationType, userId) => {
  try {
    // 次の税率コードを生成
    const taxCode = await generateNextTaxCode();
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'INSERT INTO tax_rates (tax_code, tax_name, rate, calculation_type, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
        [taxCode, taxName, rate, calculationType, userId, userId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ taxCode, taxName, rate, calculationType });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// 税率を更新
const updateTaxRate = async (taxCode, taxName, rate, calculationType, userId) => {
  try {
    // 税率の存在確認
    const existingTaxRate = await findTaxRateByCode(taxCode);
    if (!existingTaxRate) {
      throw new Error('指定された税率コードは存在しません');
    }
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'UPDATE tax_rates SET tax_name = ?, rate = ?, calculation_type = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE tax_code = ?',
        [taxName, rate, calculationType, userId, taxCode],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ taxCode, taxName, rate, calculationType });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// 税率を削除
const deleteTaxRate = async (taxCode) => {
  try {
    // 税率の存在確認
    const existingTaxRate = await findTaxRateByCode(taxCode);
    if (!existingTaxRate) {
      throw new Error('指定された税率コードは存在しません');
    }
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'DELETE FROM tax_rates WHERE tax_code = ?',
        [taxCode],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ success: true, taxCode });
          db.close();
        }
      );
    });
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
  authenticateUser,
  generateNextTaxCode,
  getAllTaxRates,
  findTaxRateByCode,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate
};
