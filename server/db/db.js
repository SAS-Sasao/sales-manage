const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

// 日本時間（JST）でYYYY/MM/DD hh:mm:ss形式の日時を返す関数
const getJstDateTime = () => {
  const now = new Date();
  // UTC時間に9時間を加算して日本時間に変換
  now.setTime(now.getTime() + 9 * 60 * 60 * 1000);
  
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');
  
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

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
        'UPDATE tax_rates SET tax_name = ?, rate = ?, calculation_type = ?, updated_by = ?, updated_at = ? WHERE tax_code = ?',
        [taxName, rate, calculationType, userId, getJstDateTime(), taxCode],
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

// 拠点コードの最大値を取得して次のコードを生成
const generateNextLocationCode = () => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT MAX(CAST(location_code AS INTEGER)) as maxCode FROM locations', [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      let nextCode = 1;
      if (row && row.maxCode) {
        nextCode = row.maxCode + 1;
      }
      
      // 2桁のゼロ埋め文字列に変換
      const nextLocationCode = String(nextCode).padStart(2, '0');
      resolve(nextLocationCode);
      
      db.close();
    });
  });
};

// 全ての拠点を取得
const getAllLocations = () => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.all('SELECT * FROM locations ORDER BY CAST(location_code AS INTEGER)', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(rows);
      db.close();
    });
  });
};

// 拠点をコードで検索
const findLocationByCode = (locationCode) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT * FROM locations WHERE location_code = ?', [locationCode], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(row);
      db.close();
    });
  });
};

// 新しい拠点を作成
const createLocation = async (locationName, userId) => {
  try {
    // 次の拠点コードを生成
    const locationCode = await generateNextLocationCode();
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'INSERT INTO locations (location_code, location_name, created_by, updated_by) VALUES (?, ?, ?, ?)',
        [locationCode, locationName, userId, userId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ locationCode, locationName });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// 拠点を更新
const updateLocation = async (locationCode, locationName, userId) => {
  try {
    // 拠点の存在確認
    const existingLocation = await findLocationByCode(locationCode);
    if (!existingLocation) {
      throw new Error('指定された拠点コードは存在しません');
    }
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'UPDATE locations SET location_name = ?, updated_by = ?, updated_at = ? WHERE location_code = ?',
        [locationName, userId, getJstDateTime(), locationCode],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ locationCode, locationName });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// 拠点を削除
const deleteLocation = async (locationCode) => {
  try {
    // 拠点の存在確認
    const existingLocation = await findLocationByCode(locationCode);
    if (!existingLocation) {
      throw new Error('指定された拠点コードは存在しません');
    }
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'DELETE FROM locations WHERE location_code = ?',
        [locationCode],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ success: true, locationCode });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// 全てのプルダウン項目IDを取得
const getAllDropdownIds = () => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.all('SELECT DISTINCT dropdown_id FROM dropdown_items ORDER BY dropdown_id', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(rows.map(row => row.dropdown_id));
      db.close();
    });
  });
};

// 特定のプルダウンIDに関連する全ての項目を取得
const getDropdownItemsById = (dropdownId) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.all('SELECT * FROM dropdown_items WHERE dropdown_id = ? ORDER BY id', [dropdownId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(rows);
      db.close();
    });
  });
};

// 全てのプルダウン項目を取得
const getAllDropdownItems = () => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.all('SELECT * FROM dropdown_items ORDER BY dropdown_id, id', [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(rows);
      db.close();
    });
  });
};

// プルダウン項目を検索
const findDropdownItem = (dropdownId, dropdownValue) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.get('SELECT * FROM dropdown_items WHERE dropdown_id = ? AND dropdown_value = ?', [dropdownId, dropdownValue], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      resolve(row);
      db.close();
    });
  });
};

// 新しいプルダウン項目を作成
const createDropdownItem = async (dropdownId, dropdownValue, userId) => {
  try {
    // 重複チェック
    const existingItem = await findDropdownItem(dropdownId, dropdownValue);
    if (existingItem) {
      throw new Error('このプルダウンIDと値の組み合わせは既に存在します');
    }
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'INSERT INTO dropdown_items (dropdown_id, dropdown_value, created_by, updated_by) VALUES (?, ?, ?, ?)',
        [dropdownId, dropdownValue, userId, userId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          resolve({ id: this.lastID, dropdownId, dropdownValue });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// プルダウン項目を更新
const updateDropdownItem = async (id, dropdownId, dropdownValue, userId) => {
  try {
    // 重複チェック（同じIDで別の項目が存在するか）
    const existingItem = await findDropdownItem(dropdownId, dropdownValue);
    if (existingItem && existingItem.id !== id) {
      throw new Error('このプルダウンIDと値の組み合わせは既に存在します');
    }
    
    return new Promise((resolve, reject) => {
      const db = getDb();
      
      db.run(
        'UPDATE dropdown_items SET dropdown_id = ?, dropdown_value = ?, updated_by = ?, updated_at = ? WHERE id = ?',
        [dropdownId, dropdownValue, userId, getJstDateTime(), id],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          if (this.changes === 0) {
            reject(new Error('指定されたIDのプルダウン項目は存在しません'));
            return;
          }
          
          resolve({ id, dropdownId, dropdownValue });
          db.close();
        }
      );
    });
  } catch (error) {
    throw error;
  }
};

// プルダウン項目を削除
const deleteDropdownItem = (id) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.run('DELETE FROM dropdown_items WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err);
        return;
      }
      
      if (this.changes === 0) {
        reject(new Error('指定されたIDのプルダウン項目は存在しません'));
        return;
      }
      
      resolve({ success: true, id });
      db.close();
    });
  });
};

// プルダウンIDに関連する全ての項目を削除
const deleteDropdownItemsById = (dropdownId) => {
  return new Promise((resolve, reject) => {
    const db = getDb();
    
    db.run('DELETE FROM dropdown_items WHERE dropdown_id = ?', [dropdownId], function(err) {
      if (err) {
        reject(err);
        return;
      }
      
      resolve({ success: true, count: this.changes, dropdownId });
      db.close();
    });
  });
};

module.exports = {
  getDb,
  getJstDateTime,
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
  deleteTaxRate,
  generateNextLocationCode,
  getAllLocations,
  findLocationByCode,
  createLocation,
  updateLocation,
  deleteLocation,
  getAllDropdownIds,
  getDropdownItemsById,
  getAllDropdownItems,
  findDropdownItem,
  createDropdownItem,
  updateDropdownItem,
  deleteDropdownItem,
  deleteDropdownItemsById
};
