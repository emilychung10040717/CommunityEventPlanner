import { useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate,Link } from 'react-router-dom';



const EventForm = ({ events, setEvents, editingEvent, setEditingEvent }) => {

  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', capacity: '', organizer : '', category: '', ticketRequired : '', ageRestriction : '', 
        suburb : '', location : '', expStartDate : '', expStartTime : '', expFinDate : '', expFinTime : '', description: '', image: ''});
  const navigate = useNavigate();

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        capacity: editingEvent.capacity,
        organizer : editingEvent.organizer,
        category :editingEvent.category,
        ticketRequired : editingEvent.ticketRequired,
        ageRestriction : editingEvent.ageRestriction,
        suburb : editingEvent.suburb,
        location : editingEvent.location,
        expStartDate : editingEvent.expStartDate,
        expStartTime : editingEvent.expStartTime,
        expFinDate : editingEvent.expFinDate,
        expFinTime : editingEvent.expFinTime,
        description: editingEvent.description,
        image: null,
      });
     
      //result to default
    } else {
      setFormData({ 
        title: '', capacity: '', organizer : '', category: '', ticketRequired : '', ageRestriction : '', 
        suburb : '', location : '', expStartDate : '', expStartTime : '', expFinDate : '', expFinTime : '', description: '' 
      });
    }
 

  }, [editingEvent]);
  //update
  const handleSubmit = async (e) => {
    e.preventDefault();
    
// 🛡️ 1. 安全防護：確保使用者已登入，否則後續讀取 user._id 會報錯
    if (!user || !user.token) {
        alert("Session expired. Please log in again.");
        return;
    }

    // 🔍 監視器：開發時確認資料正確
    console.log("Preparing to submit data:", formData);
    // 🔹 1. 整理資料：確保所有欄位符合 Schema 的要求

    console.log("Current user object:", user);
    const dataToSubmit = {
        ...formData,
        userId: user._id || user.id,          // 🔴 關鍵：補上後端要求必填的 userId
        capacity: formData.capacity,   // 確保是數字
        ticketRequired: String(formData.ticketRequired) === "true", // 轉為布林值
        ageRestriction: String(formData.ageRestriction) === "true"   // 轉為布林值
    };

    try {
        const config = {
            headers: { Authorization: `Bearer ${user.token}` },
            "Content-Type": "application/json" // 明確指定內容類型
        };
        console.log('--- 登入除錯資訊 ---');
        console.log('資料庫抓到的使用者 (user):', user._id ? '有找到' : '沒找到', user._id);

        if (editingEvent && editingEvent._id) {
            const response = await axiosInstance.put(`/api/events/${editingEvent._id}`, dataToSubmit, config);
            alert("Event Updated!");
            setEvents(events.map((event) => (event._id === response.data._id ? response.data : event)));
        

        } else {  // event add
            // 🔍 這裡是最關鍵的除錯位置
            console.log('--- [Debug] Create Event Step ---');
            console.log('1. User ID from state:', user?._id || user?.id); 
            console.log('2. Data to be sent to Backend:', dataToSubmit);
            
            // 如果你想更嚴格一點，可以在這裡加一個檢查，防止空 ID 送出
            if (!dataToSubmit.userId) {
                console.error('❌ 警告：userId 是空的！後端可能會拒絕這個請求。');
            }

            // 🔹 發送後，後端會回傳包含自動生成的 _id 的 event 物件
            const response = await axiosInstance.post('/api/events', dataToSubmit, config);
            
            console.log('3. Backend Response:', response.data); // 確認後端存完後回傳的結果
            alert("Event added!");
            navigate('/viewevent');
            // 🔹 這裡的 response.data 就包含了資料庫產生的 _id
            setEvents([...events, response.data]); 
        }

        //成功後重置表單
        setEditingEvent(null);
        setFormData({ title: '', capacity: '', organizer : '', category: '', ticketRequired : '', ageRestriction : '', 
        suburb : '', location : '', expStartDate : '', expStartTime : '', expFinDate : '', expFinTime : '', description: '', image: ''  });

    } catch (error) {
// 🔍 強化報錯：讓妳知道是網路問題還是後端邏輯問題
        const errorMsg = error.response?.data?.message || error.message || "Unknown error";
        console.error("Submission Failed:", errorMsg);
        alert(`Failed to save event: ${errorMsg}`);
    }
};


//   //original
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Submitting form data:", formData); // 🔹確認前端送出的資料
//     try {
//       if (editingEvent) {
//         const response = await axiosInstance.put(`/api/events/${editingEvent._id}`, formData, {      //0330 fix
//           headers: { Authorization: `Bearer ${user.token}`,'Content-Type': 'multipart/form-data' },
//         });
//           alert("Event Updated!");
//         setEvents(events.map((event) => (event._id === response.data._id ? response.data : event)));
//       } else {
//         const response = await axiosInstance.post('/api/events', formData, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//           alert("Event added!")
//         setEvents([...events, response.data]);
//       }
//       setEditingEvent(null);
//       setFormData({ title: '', capacity: '', organizer : '', category: '', ticketRequired : '', ageRestriction : '', 
//         suburb : '', location : '', expStartDate : '', expStartTime : '', expFinDate : '', expFinTime : '', description: '', image: '' });
//     } catch (error) {
//       alert('Failed to save event.');
//     }
//   };
//   // // 提取重置邏輯，保持程式碼整潔
// const resetForm = () => {
//     setEditingEvent(null);
//     setFormData({ 
//         title: '', capacity: '', organizer : '', category: '', 
//         ticketRequired : 'false', ageRestriction : 'false', 
//         suburb : '', location : '', expStartDate : '', 
//         expStartTime : '', expFinDate : '', expFinTime : '', 
//         description: '',
//     });
// };

  return (
    <form onSubmit={handleSubmit} className="max-w-8xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm mb-6 border border-gray-100">
      <div className="bg-purple-100 py-3 rounded-xl mb-6 text-center">
        <h1 className="text-3xl font-light text-purple-600 tracking-wide">Create event</h1>
      </div>
      {/* button for return back*/}
      <Link 
        to="/ViewEvent"
        className="flex items-center text-purple-400 mb-8 hover:text-purple-600 transition-colors">
        <span className="mr-2">←</span> View Event
      </Link>

      {/* first row for title/capacity/organizzer */}
      <div className="grid grid-cols-1 grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-gray-700 font-medium">Event Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="capacity" className="block text-gray-700 font-medium">Capacity</label>
          <input
            id="capacity"
            type="number"
            placeholder="Enter the maximum number of participants, e.g.: 100"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="organizer" className="block text-gray-700 font-medium">Organizer</label>
          <input
            id="organizer"
            type="text"
            value={formData.organizer}
            placeholder="Enter the organizer of the event"
            onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>
      </div>

      {/* second row for category/ticketrequired/age */}
      <div className="grid grid-cols-1 grid-cols-3 gap-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="category" className="block text-gray-700 font-medium ml-1">Category</label>
          <input
            id="category"
            type="text"
            placeholder="Enter the category of the event"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ageRestriction" className="block text-gray-700 font-medium ml-1">Ticket Required</label>
          <select 
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
            
            onChange={(e) => setFormData({ ...formData, ticketRequired: e.target.value === "true"})}
          >
            <option>Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="ageRestriction" className="block text-gray-700 font-medium ml-1">Age Restriction</label>
          <select 
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
            onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.value === "true" })}
          >
            <option>Select</option>
            <option value="true">18+</option>
            <option value="false">No</option>
          </select>   
        </div>
      </div>

      {/* row 3 for suburb and location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="suburb" className="block text-gray-700 font-medium ml-1">Suburb</label>
          <select 
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
            value={formData.suburb}
            onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
          >
            <option>Select</option>
            <option value="Brisbane CBD">Brisbane CBD</option>
            <option value="Sunnybank">Sunnybank</option>
            <option value="South Bank">South Bank</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="block text-gray-700 font-medium ml-1">Location</label>
          <select 
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value})}
          >
            <option>Select</option>
            <option value="Art Centre">Art Centre</option>
            <option value="Botanic Garden">Botanic Garden</option>
            <option value="Queensland Museum">Queensland Museum</option>
          </select>
        </div>
      </div>

      {/* row 4 start date & time*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="expStartDate" className="block text-gray-700 font-medium ml-1">Expected Start Date</label>
          <input
            id="expStartDate"
            type="date"
            value={formData.expStartDate}
            onChange={(e) => setFormData({ ...formData, expStartDate: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="expStartTime" className="block text-gray-700 font-medium ml-1">Expected Start Time</label>
          <input
            id="expStartTime"
            type="time"
            value={formData.expStartTime}
            onChange={(e) => setFormData({ ...formData, expStartTime: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>
      </div>

      {/* row 5 finish date & time*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="expFinDate" className="block text-gray-700 font-medium ml-1">Expected Finish Date</label>
          <input
            id="expFinDate"
            type="date"
            value={formData.expFinDate}
            onChange={(e) => setFormData({ ...formData, expFinDate: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="expFinTime" className="block text-gray-700 font-medium ml-1">Expected Finish Time</label>
          <input
            id="expFinTime"
            type="time"
            value={formData.expFinTime}
            onChange={(e) => setFormData({ ...formData, expFinTime: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>
      </div>

      {/* row 6 for description and image*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6 mb-8">
        <div className="space-y-2">
          <label htmlFor="description" className="block text-gray-700 font-medium ml-1">Description</label>
          <input
            id="description"
            type="text"
            placeholder="Enter mroe description for the event"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div>

        {/* <div className="space-y-2">
          <label htmlFor="image" className="block text-gray-700 font-medium ml-1">Upload Image</label>
          <input
            id="image"
            type="file"
            //ref={fileInputRef}
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 placeholder-gray-300"
          />
        </div> */}
      </div>

      {/*check column*/}
      <div className="flex items-center justify-center gap-3 mb-10 text-gray-400 font-light">
        <input type="checkbox" className="w-6 h-6 rounded-full border-gray-300 accent-purple-500" required />
        <p>I'm for sure all the details are correct before I submit it!</p>
      </div>
      
      {/*submit button*/}
      <div className="flex justify-center">
        <button type="submit" className="w-full bg-[#D1B3E2] hover:bg-[#C2A2D4] text-white py-4 rounded-2xl shadow-lg shadow-purple-100 flex justify-center items-center font-bold tracking-widest relative overflow-hidden text-xl">
          Create Event
        </button>
      </div>
    </form>
  );
  
};


export default EventForm;


