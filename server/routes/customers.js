const express = require('express');
const router = express.Router();
const db = require('../db/db');

// 得意先一覧の取得
router.get('/', (req, res) => {
  const query = 'SELECT * FROM customers ORDER BY customer_code';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('得意先一覧の取得エラー:', err);
      return res.status(500).json({ error: '得意先一覧の取得に失敗しました' });
    }
    
    res.json(rows);
  });
});

// 得意先の取得（ID指定）
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM customers WHERE id = ?';
  
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(`得意先(ID: ${id})の取得エラー:`, err);
      return res.status(500).json({ error: '得意先の取得に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '得意先が見つかりません' });
    }
    
    res.json(row);
  });
});

// 得意先の取得（コード指定）
router.get('/code/:code', (req, res) => {
  const { code } = req.params;
  const query = 'SELECT * FROM customers WHERE customer_code = ?';
  
  db.get(query, [code], (err, row) => {
    if (err) {
      console.error(`得意先(コード: ${code})の取得エラー:`, err);
      return res.status(500).json({ error: '得意先の取得に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '得意先が見つかりません' });
    }
    
    res.json(row);
  });
});

// 得意先の作成
router.post('/', (req, res) => {
  const {
    customer_code,
    customer_name,
    department_name,
    honorific,
    postal_code,
    address1,
    address2,
    phone_number,
    fax_number,
    email,
    invoice_number,
    invoice_issuance,
    invoice_method,
    closing_day,
    payment_day,
    payment_site_day,
    tax_processing,
    tax_rounding,
    staff_id,
    wo_special_code,
    created_by,
    updated_by
  } = req.body;
  
  // 必須項目のバリデーション
  if (!customer_code || !customer_name || !honorific || !invoice_issuance || !tax_processing || !tax_rounding) {
    return res.status(400).json({ error: '必須項目が入力されていません' });
  }
  
  // 得意先コードの重複チェック
  db.get('SELECT * FROM customers WHERE customer_code = ?', [customer_code], (err, row) => {
    if (err) {
      console.error('得意先コード重複チェックエラー:', err);
      return res.status(500).json({ error: '得意先の作成に失敗しました' });
    }
    
    if (row) {
      return res.status(400).json({ error: '既に存在する得意先コードです' });
    }
    
    const query = `
      INSERT INTO customers (
        customer_code, customer_name, department_name, honorific,
        postal_code, address1, address2, phone_number, fax_number,
        email, invoice_number, invoice_issuance, invoice_method,
        closing_day, payment_day, payment_site_day, tax_processing,
        tax_rounding, staff_id, wo_special_code, created_by,
        created_at, updated_by, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, datetime('now'))
    `;
    
    const params = [
      customer_code,
      customer_name,
      department_name || null,
      honorific,
      postal_code || null,
      address1 || null,
      address2 || null,
      phone_number || null,
      fax_number || null,
      email || null,
      invoice_number || null,
      invoice_issuance,
      invoice_method || null,
      closing_day || null,
      payment_day || null,
      payment_site_day || null,
      tax_processing,
      tax_rounding,
      staff_id || null,
      wo_special_code || null,
      created_by,
      updated_by
    ];
    
    db.run(query, params, function(err) {
      if (err) {
        console.error('得意先作成エラー:', err);
        return res.status(500).json({ error: '得意先の作成に失敗しました' });
      }
      
      // 作成した得意先を取得して返す
      db.get('SELECT * FROM customers WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('作成した得意先の取得エラー:', err);
          return res.status(500).json({ error: '得意先の作成に失敗しました' });
        }
        
        res.status(201).json(row);
      });
    });
  });
});

// 得意先の更新
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    customer_code,
    customer_name,
    department_name,
    honorific,
    postal_code,
    address1,
    address2,
    phone_number,
    fax_number,
    email,
    invoice_number,
    invoice_issuance,
    invoice_method,
    closing_day,
    payment_day,
    payment_site_day,
    tax_processing,
    tax_rounding,
    staff_id,
    wo_special_code,
    updated_by
  } = req.body;
  
  // 必須項目のバリデーション
  if (!customer_code || !customer_name || !honorific || !invoice_issuance || !tax_processing || !tax_rounding) {
    return res.status(400).json({ error: '必須項目が入力されていません' });
  }
  
  // 得意先の存在確認
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(`得意先(ID: ${id})の存在確認エラー:`, err);
      return res.status(500).json({ error: '得意先の更新に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '得意先が見つかりません' });
    }
    
    // 得意先コードの重複チェック（自分以外）
    db.get('SELECT * FROM customers WHERE customer_code = ? AND id != ?', [customer_code, id], (err, row) => {
      if (err) {
        console.error('得意先コード重複チェックエラー:', err);
        return res.status(500).json({ error: '得意先の更新に失敗しました' });
      }
      
      if (row) {
        return res.status(400).json({ error: '既に存在する得意先コードです' });
      }
      
      const query = `
        UPDATE customers SET
          customer_code = ?,
          customer_name = ?,
          department_name = ?,
          honorific = ?,
          postal_code = ?,
          address1 = ?,
          address2 = ?,
          phone_number = ?,
          fax_number = ?,
          email = ?,
          invoice_number = ?,
          invoice_issuance = ?,
          invoice_method = ?,
          closing_day = ?,
          payment_day = ?,
          payment_site_day = ?,
          tax_processing = ?,
          tax_rounding = ?,
          staff_id = ?,
          wo_special_code = ?,
          updated_by = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `;
      
      const params = [
        customer_code,
        customer_name,
        department_name || null,
        honorific,
        postal_code || null,
        address1 || null,
        address2 || null,
        phone_number || null,
        fax_number || null,
        email || null,
        invoice_number || null,
        invoice_issuance,
        invoice_method || null,
        closing_day || null,
        payment_day || null,
        payment_site_day || null,
        tax_processing,
        tax_rounding,
        staff_id || null,
        wo_special_code || null,
        updated_by,
        id
      ];
      
      db.run(query, params, function(err) {
        if (err) {
          console.error(`得意先(ID: ${id})の更新エラー:`, err);
          return res.status(500).json({ error: '得意先の更新に失敗しました' });
        }
        
        // 更新した得意先を取得して返す
        db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error(`更新した得意先(ID: ${id})の取得エラー:`, err);
            return res.status(500).json({ error: '得意先の更新に失敗しました' });
          }
          
          res.json(row);
        });
      });
    });
  });
});

// 得意先の削除
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // 得意先の存在確認
  db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(`得意先(ID: ${id})の存在確認エラー:`, err);
      return res.status(500).json({ error: '得意先の削除に失敗しました' });
    }
    
    if (!row) {
      return res.status(404).json({ error: '得意先が見つかりません' });
    }
    
    // 得意先の削除
    db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
      if (err) {
        console.error(`得意先(ID: ${id})の削除エラー:`, err);
        return res.status(500).json({ error: '得意先の削除に失敗しました' });
      }
      
      res.status(204).end();
    });
  });
});

module.exports = router;
