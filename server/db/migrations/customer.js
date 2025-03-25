const sqlite3 = require('sqlite3').verbose();
const dbModule = require('../db');
const db = dbModule.getDb();

// 得意先マスタテーブルの作成
const createCustomerTable = () => {
  return new Promise((resolve, reject) => {
    const query = `
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_code TEXT NOT NULL UNIQUE,
        customer_name TEXT NOT NULL,
        department_name TEXT,
        honorific TEXT NOT NULL,
        postal_code TEXT,
        address1 TEXT,
        address2 TEXT,
        phone_number TEXT,
        fax_number TEXT,
        email TEXT,
        invoice_number TEXT,
        invoice_issuance TEXT NOT NULL,
        invoice_method TEXT,
        closing_day TEXT,
        payment_day TEXT,
        payment_site_day TEXT,
        tax_processing TEXT NOT NULL,
        tax_rounding TEXT NOT NULL,
        staff_id INTEGER,
        wo_special_code TEXT,
        created_by TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_by TEXT,
        updated_at TEXT
      )
    `;

    db.run(query, (err) => {
      if (err) {
        console.error('得意先マスタテーブルの作成に失敗しました:', err);
        reject(err);
      } else {
        console.log('得意先マスタテーブルが正常に作成されました');
        resolve();
      }
    });
  });
};

// 初期データの挿入（必要に応じて）
const insertInitialData = () => {
  return new Promise((resolve, reject) => {
    // 既存のデータがあるか確認
    db.get('SELECT COUNT(*) as count FROM customers', (err, row) => {
      if (err) {
        console.error('データ確認中にエラーが発生しました:', err);
        reject(err);
        return;
      }

      // データが存在しない場合のみ初期データを挿入
      if (row.count === 0) {
        const initialData = [
          {
            customer_code: '0000000000000001',
            customer_name: 'サンプル株式会社',
            department_name: '営業部',
            honorific: '御中',
            postal_code: '1000001',
            address1: '東京都千代田区千代田1-1',
            address2: '千代田ビル10F',
            phone_number: '0312345678',
            fax_number: '0312345679',
            email: 'sample@example.com',
            invoice_number: '1234567890123',
            invoice_issuance: '有',
            invoice_method: '郵送',
            closing_day: '末日',
            payment_day: '翌月末日',
            payment_site_day: '',
            tax_processing: '請求書単位',
            tax_rounding: '切捨て',
            staff_id: 1,
            wo_special_code: '',
            created_by: 'system',
            created_at: new Date().toISOString(),
            updated_by: null,
            updated_at: null
          }
        ];

        const placeholders = initialData.map(() => {
          return `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        }).join(', ');

        const values = initialData.flatMap(data => [
          data.customer_code,
          data.customer_name,
          data.department_name,
          data.honorific,
          data.postal_code,
          data.address1,
          data.address2,
          data.phone_number,
          data.fax_number,
          data.email,
          data.invoice_number,
          data.invoice_issuance,
          data.invoice_method,
          data.closing_day,
          data.payment_day,
          data.payment_site_day,
          data.tax_processing,
          data.tax_rounding,
          data.staff_id,
          data.wo_special_code,
          data.created_by,
          data.created_at,
          data.updated_by,
          data.updated_at
        ]);

        const insertQuery = `
          INSERT INTO customers (
            customer_code, customer_name, department_name, honorific,
            postal_code, address1, address2, phone_number, fax_number,
            email, invoice_number, invoice_issuance, invoice_method,
            closing_day, payment_day, payment_site_day, tax_processing,
            tax_rounding, staff_id, wo_special_code, created_by,
            created_at, updated_by, updated_at
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
const initializeCustomerTable = async () => {
  try {
    await createCustomerTable();
    await insertInitialData();
    console.log('得意先マスタテーブルの初期化が完了しました');
  } catch (err) {
    console.error('得意先マスタテーブルの初期化中にエラーが発生しました:', err);
  }
};

// エクスポート
module.exports = {
  initializeCustomerTable
};
