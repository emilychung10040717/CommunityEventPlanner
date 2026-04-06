
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };

//0504
// const protect = async (req, res, next) => {
//     let token;

//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//         console.log("Check decoded token:", decoded);   //0504 update
//         console.log("Check req.user:", req.user);       //0504 update
        
//         try {
//             token = req.headers.authorization.split(' ')[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             // 🔹 修改點 1：確保從 Token 拿到的 Key 是正確的
//             // 建議同時檢查 .id 或 ._id (視妳 generateToken 的寫法而定)
//             const userId = decoded.id || decoded._id;

//             // 🔹 修改點 2：抓取使用者
//             req.user = await User.findById(userId).select('-password');

//             // 🔹 修改點 3：安全檢查！如果找不到使用者，直接回傳錯誤，不要往下走 next()
//             if (!req.user) {
//                 return res.status(401).json({ message: 'User not found in database' });
//             }

//             return next(); // 成功後一定要 return next() 確保邏輯切斷
//         } catch (error) {
//             console.error("Auth error:", error.message);
//             return res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }

//     if (!token) {
//         return res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

// module.exports = { protect };