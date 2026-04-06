
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, phone, organizer, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword){
            return res.status(400).json({message: 'Confirm password is not match, please enter again!'});
        }
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        
        const user = await User.create({ name, email, phone, organizer, password});
        res.status(201).json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    //const isMatch = await bcrypt.compare(password, user.password);
    try {
        const user = await User.findOne({ email }).select('+password');
        // console.log('--- 登入除錯資訊 ---');
        // console.log('前端傳來的密碼 (password):', password);
        // console.log('資料庫抓到的使用者 (user):', user ? '有找到' : '沒找到');
        // console.log('資料庫抓到的使用者 (user):', user._id ? '有找到' : '沒找到', user._id);
        // if (user) {
        //     console.log('資料庫裡的加密密碼 (user.password):', user.password);
        // }
        // console.log('--------------------');
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ id: user.id, email: user.email, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        name: user.name,
        email: user.email,
        phone: user.phone,
        organizer: user.organizer,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, phone, organizer } = req.body;
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.organizer = organizer || user.organizer;

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, organizer: updatedUser.organizer, token: generateToken(updatedUser.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
