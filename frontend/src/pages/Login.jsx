import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);    
      login(response.data);
      navigate('/events');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="flex justify-center mb-10">
        <div className="text-[#D1B3E2] text-3xl">Community Event Planner</div> 
      </div>

<div className="flex items-center justify-between mb-8">
  {/* 左側標題 */}
  <h1 className="text-3xl font-semibold text-gray-800">Log in</h1>

  {/* 右側選項容器：改為 flex-col 讓內容上下排列 */}
  <div className="flex flex-col items-start space-y-2">
    
    {/* 第一個選項：Member (已禁用) */}
    <div className="opacity-50 cursor-not-allowed">  {/*visualization for disabled status*/}
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="userType"
          className="w-4 h-4 accent-purple-400"
          disabled // 真正的禁用屬性要加在 input 上
        />
        <span className="text-gray-400 text-sm font-light leading-none">
          I'm a community member <br/>
          <span className="text-xs text-red-300">[Not available now]</span>
        </span>
      </label>
    </div>

    {/* 第二個選項：Organizer */}
    <div>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="userType"
          className="w-4 h-4 accent-purple-400"
          defaultChecked
        />
        <span className="text-gray-400 text-sm font-light leading-none">
          I'm an event organizer
        </span>
      </label>
    </div>
    
  </div>
</div>
 
     
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className ="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-Black-400"> Email   
          </span>
          <input
            type="email"
            placeholder="abc@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-24 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
          />
          </div>
        
        <div className ="relative">
          <span className="absolute inset-y-0 left-4 flex items-center text-Black-400"> Password   
          </span>
          <input
            type="password"
            placeholder="Your Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-24 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all"
          />
        </div>
        {/* forget passwoord */}
        {/* <div className="text-right">
          <a href="#" className="text-sm text-gray-600 hover:underline">Forgot Password?</a>
        </div> */}

        <div className="text-left">
          <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="userType"
            className="w-4 h-4 accent-purple-400"
            disabled // 真正的禁用屬性要加在 input 上
          />
          <span className="text-gray-400 text-sm font-light leading-none">
            I'm ADMIN <br/>
            <span className="text-xs text-red-300">[Not available now]</span>
          </span>
          </label>
        </div>

        {/* 登入按鈕 - 這裡實作了圖片中的大圓弧與紫色漸層感 */}
        <button
          type="submit"
          className="w-full bg-[#D1B3E2] hover:bg-[#C2A2D4] text-white py-4 rounded-2xl shadow-lg shadow-purple-100 flex justify-center items-center font-bold tracking-widest relative overflow-hidden"
        >
          LOG IN
          <span className="absolute right-4 bg-[#7D5A94] rounded-full p-1 w-8 h-8 flex items-center justify-center">
            →
          </span>
        </button>
      </form>
      <Link to='/Register'>
        <p className="mt-8 text-center text-gray-600">
        Don't have an account? <span className="text-purple-300 cursor-pointer hover:underline">Register</span>
        </p>
      </Link>
    </div>
  );
};

export default Login;
