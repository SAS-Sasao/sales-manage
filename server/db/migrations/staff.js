const sqlite3 = require('sqlite3').verbose();
const dbModule = require('../db');
const db = dbModule.getDb();

// 担当者マスタテーブルの作成
const createStaffTable = () => {
  return new Promise((resolve, reject) => {
    const query = `
      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_code TEXT NOT NULL UNIQUE,
        staff_name TEXT NOT NULL,
        email TEXT,
        department TEXT,
        position TEXT,
        phone_number TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_by TEXT,
        updated_at TEXT
      )
    `;

    db.run(query, (err) => {
      if (err) {
        console.error('担当者マスタテーブルの作成に失敗しました:', err);
        reject(err);
      } else {
        console.log('担当者マスタテーブルが正常に作成されました');
        resolve();
      }
    });
  });
};

// 初期データの挿入（必要に応じて）
const insertInitialData = () => {
  return new Promise((resolve, reject) => {
    // 既存のデータがあるか確認
    db.get('SELECT COUNT(*) as count FROM staff', (err, row) => {
      if (err) {
        console.error('データ確認中にエラーが発生しました:', err);
        reject(err);
        return;
      }

      // データが存在しない場合のみ初期データを挿入
      if (row.count === 0) {
        const initialData = [
          {
            staff_code: '00001',
            staff_name: '山田 太郎',
            email: 'yamada@example.com',
            department: '営業部',
            position: '部長',
            phone_number: '0312345678',
            is_active: 1,
            created_by: 'system',
            created_at: new Date().toISOString(),
            updated_by: null,
            updated_at: null
          },
          {
            staff_code: '00002',
            staff_name: '鈴木 一郎',
            email: 'suzuki@example.com',
            department: '営業部',
            position: '課長',
            phone_number: '0312345679',
            is_active: 1,
            created_by: 'system',
            created_at: new Date().toISOString(),
            updated_by: null,
            updated_at: null
          },
          {
            staff_code: '00003',
            staff_name: '佐藤 花子',
            email: 'sato@example.com',
            department: '経理部',
            position: '主任',
            phone_number: '0312345680',
            is_active: 1,
            created_by: 'system',
            created_at: new Date().toISOString(),
            updated_by: null,
            updated_at: null
          }
        ];

        const placeholders = initialData.map(() => {
          return `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        }).join(', ');

        const values = initialData.flatMap(data => [
          data.staff_code,
          data.staff_name,
          data.email,
          data.department,
          data.position,
          data.phone_number,
          data.is_active,
          data.created_by,
          data.created_at,
          data.updated_by,
          data.updated_at
        ]);

        const insertQuery = `
          INSERT INTO staff (
            staff_code, staff_name, email, department, position,
            phone_number, is_active, created_by, created_at,
            updated_by, updated_at
          ) VALUES ${placeholders}
        `;

        db.run(insertQuery, values, (err) => {
          if (err) {
            console.error('初期データの挿入に失敗しました:', err);
            reject(err);
          } else {
            console.log('初期データが正常に挿入されました');
            resolve();
          }
        });
      } else {
        console.log('既存のデータが存在するため、初期データは挿入しません');
        resolve();
      }
    });
  });
};

// テーブル作成と初期データ挿入を実行
const initializeStaffTable = async () => {
  try {
    await createStaffTable();
    await insertInitialData();
    console.log('担当者マスタテーブルの初期化が完了しました');
  } catch (err) {
    console.error('担当者マスタテーブルの初期化中にエラーが発生しました:', err);
  }
};

// エクスポート
module.exports = {
  initializeStaffTable
};
