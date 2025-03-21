const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { createUser, authenticateUser } = require('./db/db');

// データベースの初期化
require('./db/init');

const app = express();
const PORT = process.env.PORT || 5555;

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
