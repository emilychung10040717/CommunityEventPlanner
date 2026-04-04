
// const cors = require('cors');
// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// dotenv.config();


// const app = express();

// app.use(cors({
//   origin: '*', // 測試時先用 *
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'], // 必須包含 Authorization
//   credentials: true
// }));

// // 確保這一行在所有路由之前
// app.options('*', cors());
// app.use(express.json());
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/events', require('./routes/eventRoutes'));

// // Export the app object for testing
// if (require.main === module) {
// connectDB();
// // If the file is run directly, start the server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }


// module.exports = app;

const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// 1. 強化 CORS 設定 (必須放在所有路由之前)
app.use(cors({
  origin: '*', // 測試階段允許所有來源，之後可改為你的前端網域
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // 務必包含 Authorization
  credentials: true
}));

// 2. 處理 OPTIONS 預檢請求的快速響應
app.options('*', cors()); 

app.use(express.json());

// 3. 路由設定
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// 連接資料庫並啟動
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
}

module.exports = app;