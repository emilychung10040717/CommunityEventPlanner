import axios from 'axios';

const axiosInstance = axios.create({
  //baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://3.26.96.188:5001', // live
  baseURL: 'http://3.25.200.91:5001',
  //baseURL: 'http://54.252.239.131:5001', // my public IP
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;  //test


// axiosConfig.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://54.252.239.131:5001'
// });

// axiosInstance.interceptors.request.use((config) => {
//   // 從 localStorage 或 context 取得 user 資料
//   const userData = localStorage.getItem('user'); 
//   if (userData) {
//     const { token } = JSON.parse(userData);
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default axiosInstance;