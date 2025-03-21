const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { 
  createUser, 
  authenticateUser,
  getAllTaxRates,
  findTaxRateByCode,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate,
  getAllLocations,
  findLocationByCode,
  createLocation,
  updateLocation,
  deleteLocation
} = require('./db/db');

// データベースの初期化
require('./db/init');

const app = express();
const PORT = process.env.PORT || 4322;

// ミドルウェア
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイルの提供（本番環境用）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// API エンドポイント

// ユーザー登録
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'メールアドレスとパスワードは必須です' });
    }
    
    const newUser = await createUser(email, password);
    
    res.status(201).json({
      success: true,
      user: {
        userId: newUser.userId,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ error: error.message || 'ユーザー登録に失敗しました' });
  }
});

// ユーザー認証（ログイン）
app.post('/api/login', async (req, res) => {
  try {
    const { userId, password } = req.body;
    
    if (!userId || !password) {
      return res.status(400).json({ error: 'ユーザーIDとパスワードは必須です' });
    }
    
    const user = await authenticateUser(userId, password);
    
    if (!user) {
      return res.status(401).json({ error: 'ユーザーIDまたはパスワードが正しくありません' });
    }
    
    res.json({
      success: true,
      user: {
        userId: user.userId,
        email: user.email
      }
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ error: error.message || 'ログインに失敗しました' });
  }
});

// 税率マスタ関連のエンドポイント

// 全ての税率を取得
app.get('/api/tax-rates', async (req, res) => {
  try {
    const taxRates = await getAllTaxRates();
    res.json({ success: true, taxRates });
  } catch (error) {
    console.error('税率取得エラー:', error);
    res.status(500).json({ error: error.message || '税率の取得に失敗しました' });
  }
});

// 税率をコードで取得
app.get('/api/tax-rates/:taxCode', async (req, res) => {
  try {
    const { taxCode } = req.params;
    const taxRate = await findTaxRateByCode(taxCode);
    
    if (!taxRate) {
      return res.status(404).json({ error: '指定された税率コードは存在しません' });
    }
    
    res.json({ success: true, taxRate });
  } catch (error) {
    console.error('税率取得エラー:', error);
    res.status(500).json({ error: error.message || '税率の取得に失敗しました' });
  }
});

// 新しい税率を作成
app.post('/api/tax-rates', async (req, res) => {
  try {
    const { taxName, rate, calculationType, userId } = req.body;
    
    if (!taxName || rate === undefined || !calculationType || !userId) {
      return res.status(400).json({ error: '税率名、税率値、計算区分、ユーザーIDは必須です' });
    }
    
    const newTaxRate = await createTaxRate(taxName, rate, calculationType, userId);
    
    res.status(201).json({
      success: true,
      taxRate: newTaxRate
    });
  } catch (error) {
    console.error('税率作成エラー:', error);
    res.status(500).json({ error: error.message || '税率の作成に失敗しました' });
  }
});

// 税率を更新
app.put('/api/tax-rates/:taxCode', async (req, res) => {
  try {
    const { taxCode } = req.params;
    const { taxName, rate, calculationType, userId } = req.body;
    
    if (!taxName || rate === undefined || !calculationType || !userId) {
      return res.status(400).json({ error: '税率名、税率値、計算区分、ユーザーIDは必須です' });
    }
    
    const updatedTaxRate = await updateTaxRate(taxCode, taxName, rate, calculationType, userId);
    
    res.json({
      success: true,
      taxRate: updatedTaxRate
    });
  } catch (error) {
    console.error('税率更新エラー:', error);
    res.status(500).json({ error: error.message || '税率の更新に失敗しました' });
  }
});

// 税率を削除
app.delete('/api/tax-rates/:taxCode', async (req, res) => {
  try {
    const { taxCode } = req.params;
    
    const result = await deleteTaxRate(taxCode);
    
    res.json({
      success: true,
      message: `税率コード ${taxCode} が削除されました`
    });
  } catch (error) {
    console.error('税率削除エラー:', error);
    res.status(500).json({ error: error.message || '税率の削除に失敗しました' });
  }
});

// 拠点マスタ関連のエンドポイント

// 全ての拠点を取得
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await getAllLocations();
    res.json({ success: true, locations });
  } catch (error) {
    console.error('拠点取得エラー:', error);
    res.status(500).json({ error: error.message || '拠点の取得に失敗しました' });
  }
});

// 拠点をコードで取得
app.get('/api/locations/:locationCode', async (req, res) => {
  try {
    const { locationCode } = req.params;
    const location = await findLocationByCode(locationCode);
    
    if (!location) {
      return res.status(404).json({ error: '指定された拠点コードは存在しません' });
    }
    
    res.json({ success: true, location });
  } catch (error) {
    console.error('拠点取得エラー:', error);
    res.status(500).json({ error: error.message || '拠点の取得に失敗しました' });
  }
});

// 新しい拠点を作成
app.post('/api/locations', async (req, res) => {
  try {
    const { locationName, userId } = req.body;
    
    if (!locationName || !userId) {
      return res.status(400).json({ error: '拠点名、ユーザーIDは必須です' });
    }
    
    const newLocation = await createLocation(locationName, userId);
    
    res.status(201).json({
      success: true,
      location: newLocation
    });
  } catch (error) {
    console.error('拠点作成エラー:', error);
    res.status(500).json({ error: error.message || '拠点の作成に失敗しました' });
  }
});

// 拠点を更新
app.put('/api/locations/:locationCode', async (req, res) => {
  try {
    const { locationCode } = req.params;
    const { locationName, userId } = req.body;
    
    if (!locationName || !userId) {
      return res.status(400).json({ error: '拠点名、ユーザーIDは必須です' });
    }
    
    const updatedLocation = await updateLocation(locationCode, locationName, userId);
    
    res.json({
      success: true,
      location: updatedLocation
    });
  } catch (error) {
    console.error('拠点更新エラー:', error);
    res.status(500).json({ error: error.message || '拠点の更新に失敗しました' });
  }
});

// 拠点を削除
app.delete('/api/locations/:locationCode', async (req, res) => {
  try {
    const { locationCode } = req.params;
    
    const result = await deleteLocation(locationCode);
    
    res.json({
      success: true,
      message: `拠点コード ${locationCode} が削除されました`
    });
  } catch (error) {
    console.error('拠点削除エラー:', error);
    res.status(500).json({ error: error.message || '拠点の削除に失敗しました' });
  }
});

// 本番環境では、すべてのリクエストをReactアプリにリダイレクト
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
