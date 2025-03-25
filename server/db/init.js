const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const { initializeCustomerTable } = require('./migrations/customer');

// データベースファイルのパス
const dbPath = path.join(__dirname, 'sales_manage.db');

// データベース接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
    return;
  }
  console.log('SQLiteデータベースに接続しました');
  
  // ユーザーテーブルの作成
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('ユーザーテーブル作成エラー:', err.message);
      return;
    }
    console.log('ユーザーテーブルが作成されました');
    
    // 初期ユーザーの追加（開発用）
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword1 = bcrypt.hashSync('password1', salt);
    const hashedPassword2 = bcrypt.hashSync('password2', salt);
    
    // ユーザーが存在するか確認してから追加
    db.get('SELECT * FROM users WHERE user_id = ?', ['00001'], (err, row) => {
      if (err) {
        console.error('ユーザー確認エラー:', err.message);
        return;
      }
      
      if (!row) {
        db.run(
          'INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)',
          ['00001', 'user1@example.com', hashedPassword1],
          (err) => {
            if (err) {
              console.error('初期ユーザー1追加エラー:', err.message);
              return;
            }
            console.log('初期ユーザー1が追加されました');
          }
        );
      }
    });
    
    db.get('SELECT * FROM users WHERE user_id = ?', ['00002'], (err, row) => {
      if (err) {
        console.error('ユーザー確認エラー:', err.message);
        return;
      }
      
      if (!row) {
        db.run(
          'INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)',
          ['00002', 'user2@example.com', hashedPassword2],
          (err) => {
            if (err) {
              console.error('初期ユーザー2追加エラー:', err.message);
              return;
            }
            console.log('初期ユーザー2が追加されました');
          }
        );
      }
    });
  });

  // 税率マスタテーブルの作成
  db.run(`
    CREATE TABLE IF NOT EXISTS tax_rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tax_code TEXT UNIQUE NOT NULL,
      tax_name TEXT NOT NULL,
      rate REAL NOT NULL,
      calculation_type INTEGER NOT NULL,
      created_by TEXT NOT NULL,
      updated_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('税率マスタテーブル作成エラー:', err.message);
      return;
    }
    console.log('税率マスタテーブルが作成されました');
    
    // 初期税率データの追加（開発用）
    const initialTaxRates = [
      { tax_name: '10%', rate: 10, calculation_type: 3, created_by: '00001', updated_by: '00001' },
      { tax_name: '8%(軽減税率)', rate: 8, calculation_type: 3, created_by: '00001', updated_by: '00001' },
      { tax_name: '8%(経過措置)', rate: 8, calculation_type: 3, created_by: '00001', updated_by: '00001' },
      { tax_name: '非課税', rate: 0, calculation_type: 3, created_by: '00001', updated_by: '00001' },
      { tax_name: '対象外', rate: 0, calculation_type: 3, created_by: '00001', updated_by: '00001' }
    ];
    
    // 税率コードの最大値を取得
    db.get('SELECT MAX(CAST(tax_code AS INTEGER)) as maxCode FROM tax_rates', [], (err, row) => {
      if (err) {
        console.error('税率コード取得エラー:', err.message);
        return;
      }
      
      let nextCode = 1;
      if (row && row.maxCode) {
        nextCode = row.maxCode + 1;
      }
      
      // 初期税率データを追加
      initialTaxRates.forEach((taxRate) => {
        const taxCode = String(nextCode).padStart(2, '0');
        
        db.get('SELECT * FROM tax_rates WHERE tax_name = ?', [taxRate.tax_name], (err, row) => {
          if (err) {
            console.error('税率確認エラー:', err.message);
            return;
          }
          
          if (!row) {
            db.run(
              'INSERT INTO tax_rates (tax_code, tax_name, rate, calculation_type, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
              [taxCode, taxRate.tax_name, taxRate.rate, taxRate.calculation_type, taxRate.created_by, taxRate.updated_by],
              (err) => {
                if (err) {
                  console.error(`税率データ追加エラー (${taxRate.tax_name}):`, err.message);
                  return;
                }
                console.log(`税率データが追加されました: ${taxRate.tax_name} (${taxCode})`);
              }
            );
            nextCode++;
          }
        });
      });
    });
  });

  // 拠点マスタテーブルの作成
  db.run(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_code TEXT UNIQUE NOT NULL,
      location_name TEXT NOT NULL,
      created_by TEXT NOT NULL,
      updated_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('拠点マスタテーブル作成エラー:', err.message);
      return;
    }
    console.log('拠点マスタテーブルが作成されました');
    
    // 初期拠点データの追加（開発用）
    const initialLocations = [
      { location_name: '本社', created_by: '00001', updated_by: '00001' },
      { location_name: '東京支店', created_by: '00001', updated_by: '00001' },
      { location_name: '大阪支店', created_by: '00001', updated_by: '00001' },
      { location_name: '名古屋支店', created_by: '00001', updated_by: '00001' },
      { location_name: '福岡支店', created_by: '00001', updated_by: '00001' }
    ];
    
    // 拠点コードの最大値を取得
    db.get('SELECT MAX(CAST(location_code AS INTEGER)) as maxCode FROM locations', [], (err, row) => {
      if (err) {
        console.error('拠点コード取得エラー:', err.message);
        return;
      }
      
      let nextCode = 1;
      if (row && row.maxCode) {
        nextCode = row.maxCode + 1;
      }
      
      // 初期拠点データを追加
      initialLocations.forEach((location) => {
        const locationCode = String(nextCode).padStart(2, '0');
        
        db.get('SELECT * FROM locations WHERE location_name = ?', [location.location_name], (err, row) => {
          if (err) {
            console.error('拠点確認エラー:', err.message);
            return;
          }
          
          if (!row) {
            db.run(
              'INSERT INTO locations (location_code, location_name, created_by, updated_by) VALUES (?, ?, ?, ?)',
              [locationCode, location.location_name, location.created_by, location.updated_by],
              (err) => {
                if (err) {
                  console.error(`拠点データ追加エラー (${location.location_name}):`, err.message);
                  return;
                }
                console.log(`拠点データが追加されました: ${location.location_name} (${locationCode})`);
              }
            );
            nextCode++;
          }
        });
      });
    });
  });

  // プルダウン項目マスタテーブルの作成
  db.run(`
    CREATE TABLE IF NOT EXISTS dropdown_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dropdown_id TEXT NOT NULL,
      dropdown_value TEXT NOT NULL,
      created_by TEXT NOT NULL,
      updated_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(dropdown_id, dropdown_value)
    )
  `, (err) => {
    if (err) {
      console.error('プルダウン項目マスタテーブル作成エラー:', err.message);
      return;
    }
    console.log('プルダウン項目マスタテーブルが作成されました');
    
    // 初期プルダウン項目データの追加（開発用）
    const initialDropdownItems = [
      { dropdown_id: 'payment_method', dropdown_value: '現金', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'payment_method', dropdown_value: '銀行振込', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'payment_method', dropdown_value: 'クレジットカード', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'payment_method', dropdown_value: '電子マネー', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'delivery_status', dropdown_value: '準備中', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'delivery_status', dropdown_value: '発送済み', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'delivery_status', dropdown_value: '配達中', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'delivery_status', dropdown_value: '配達完了', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'priority', dropdown_value: '高', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'priority', dropdown_value: '中', created_by: '00001', updated_by: '00001' },
      { dropdown_id: 'priority', dropdown_value: '低', created_by: '00001', updated_by: '00001' }
    ];
    
    // 初期プルダウン項目データを追加
    initialDropdownItems.forEach((item) => {
      db.get('SELECT * FROM dropdown_items WHERE dropdown_id = ? AND dropdown_value = ?', [item.dropdown_id, item.dropdown_value], (err, row) => {
        if (err) {
          console.error('プルダウン項目確認エラー:', err.message);
          return;
        }
        
        if (!row) {
          db.run(
            'INSERT INTO dropdown_items (dropdown_id, dropdown_value, created_by, updated_by) VALUES (?, ?, ?, ?)',
            [item.dropdown_id, item.dropdown_value, item.created_by, item.updated_by],
            (err) => {
              if (err) {
                console.error(`プルダウン項目データ追加エラー (${item.dropdown_id} - ${item.dropdown_value}):`, err.message);
                return;
              }
              console.log(`プルダウン項目データが追加されました: ${item.dropdown_id} - ${item.dropdown_value}`);
            }
          );
        }
      });
    });
  });

  // 得意先マスタテーブルの初期化
  initializeCustomerTable();
});

// データベース接続を閉じる（すべての操作が完了した後）
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('データベース接続クローズエラー:', err.message);
      return;
    }
    console.log('データベース接続を閉じました');
  });
}, 3000); // 3秒後に接続を閉じる（非同期操作が完了するのを待つ）

module.exports = dbPath;
