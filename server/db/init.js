const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

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
}, 2000); // 2秒後に接続を閉じる（非同期操作が完了するのを待つ）

module.exports = dbPath;
