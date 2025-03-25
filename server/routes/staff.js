const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 担当者一覧の取得
router.get('/', (req, res) => {
  const query = 'SELECT * FROM staff ORDER BY staff_code';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('担当者一覧の取得エラー:', err);
      return res.status(500).json({ error: '担当者一覧の取得に失敗しました' });
    }
    
    res.json(rows);
  });
});

// 担当者の取得（ID指定）
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM staff WHERE id = ?';
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(`担当者(ID: ${id})の取得エラー:`, err);
      return res.status(500).json({ error: '担当者の取得に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '担当者が見つかりません' });
    }
    
    res.json(row);
  });
});

// 担当者の取得（コード指定）
router.get('/code/:code', (req, res) => {
  const { code } = req.params;
  const query = 'SELECT * FROM staff WHERE staff_code = ?';
  
  db.get(query, [code], (err, row) => {
    if (err) {
      console.error(`担当者(コード: ${code})の取得エラー:`, err);
      return res.status(500).json({ error: '担当者の取得に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '担当者が見つかりません' });
    }
    
    res.json(row);
  });
});

// 担当者の作成
router.post('/', (req, res) => {
  const {
    staff_code,
    staff_name,
    email,
    department,
    position,
    phone_number,
    is_active,
    created_by,
    updated_by
  } = req.body;
  
  // 必須項目のバリデーション
  if (!staff_code || !staff_name || is_active === undefined) {
    return res.status(400).json({ error: '必須項目が入力されていません' });
  }
  
  // 担当者コードの重複チェック
  db.get('SELECT * FROM staff WHERE staff_code = ?', [staff_code], (err, row) => {
    if (err) {
      console.error('担当者コード重複チェックエラー:', err);
      return res.status(500).json({ error: '担当者の作成に失敗しました' });
    }
    
    if (row) {
      return res.status(400).json({ error: '既に存在する担当者コードです' });
    }
    
    const query = `
      INSERT INTO staff (
        staff_code, staff_name, email, department, position,
        phone_number, is_active, created_by, created_at,
        updated_by, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, datetime('now'))
    `;
    
    const params = [
      staff_code,
      staff_name,
      email || null,
      department || null,
      position || null,
      phone_number || null,
      is_active ? 1 : 0,
      created_by,
      updated_by
    ];
    
    db.run(query, params, function(err) {
      if (err) {
        console.error('担当者作成エラー:', err);
        return res.status(500).json({ error: '担当者の作成に失敗しました' });
      }
      
      // 作成した担当者を取得して返す
      db.get('SELECT * FROM staff WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('作成した担当者の取得エラー:', err);
          return res.status(500).json({ error: '担当者の作成に失敗しました' });
        }
        
        res.status(201).json(row);
      });
    });
  });
});

// 担当者の更新
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    staff_code,
    staff_name,
    email,
    department,
    position,
    phone_number,
    is_active,
    updated_by
  } = req.body;
  
  // 必須項目のバリデーション
  if (!staff_code || !staff_name || is_active === undefined) {
    return res.status(400).json({ error: '必須項目が入力されていません' });
  }
  
  // 担当者の存在確認
  db.get('SELECT * FROM staff WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(`担当者(ID: ${id})の存在確認エラー:`, err);
      return res.status(500).json({ error: '担当者の更新に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '担当者が見つかりません' });
    }
    
    // 担当者コードの重複チェック（自分以外）
    db.get('SELECT * FROM staff WHERE staff_code = ? AND id != ?', [staff_code, id], (err, row) => {
      if (err) {
        console.error('担当者コード重複チェックエラー:', err);
        return res.status(500).json({ error: '担当者の更新に失敗しました' });
      }
      
      if (row) {
        return res.status(400).json({ error: '既に存在する担当者コードです' });
      }
      
      const query = `
        UPDATE staff SET
          staff_code = ?,
          staff_name = ?,
          email = ?,
          department = ?,
          position = ?,
          phone_number = ?,
          is_active = ?,
          updated_by = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `;
      
      const params = [
        staff_code,
        staff_name,
        email || null,
        department || null,
        position || null,
        phone_number || null,
        is_active ? 1 : 0,
        updated_by,
        id
      ];
      
      db.run(query, params, function(err) {
        if (err) {
          console.error(`担当者(ID: ${id})の更新エラー:`, err);
          return res.status(500).json({ error: '担当者の更新に失敗しました' });
        }
        
        // 更新した担当者を取得して返す
        db.get('SELECT * FROM staff WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error(`更新した担当者(ID: ${id})の取得エラー:`, err);
            return res.status(500).json({ error: '担当者の更新に失敗しました' });
          }
          
          res.json(row);
        });
      });
    });
  });
});

// 担当者の削除
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // 担当者の存在確認
  db.get('SELECT * FROM staff WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(`担当者(ID: ${id})の存在確認エラー:`, err);
      return res.status(500).json({ error: '担当者の削除に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '担当者が見つかりません' });
    }
    
    // 担当者の削除
    db.run('DELETE FROM staff WHERE id = ?', [id], function(err) {
      if (err) {
        console.error(`担当者(ID: ${id})の削除エラー:`, err);
        return res.status(500).json({ error: '担当者の削除に失敗しました' });
      }
      
      res.status(204).end();
    });
  });
});

module.exports = router;
