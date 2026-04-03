import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const ViewEvent = ({ setEditingEvent }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch 資料功能
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/events', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  console.log(user);
  console.log(user?.token);
  
  useEffect(() => {
    if (user?.token) {
      fetchEvents();
    }
  }, [user]);

  // 2. 處理刪除邏輯
  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure to delete this event?")) {
      try {
        await axiosInstance.delete(`/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // 成功後直接更新 UI，不需重新 Fetch
        setEvents(events.filter((event) => event._id !== eventId));
      } catch (error) {
        alert('Failed to delete event.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8A60A1]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-white min-h-screen shadow-sm pb-20">
      {/* 標題列 */}
      <div className="bg-purple-100 py-3 rounded-xl mb-6 text-center">
        <h1 className="text-3xl font-light text-purple-600 tracking-wide">View event</h1>
      </div>

      <div className="px-8">
        <Link to="/Events" className="flex items-center text-[#8A60A1] mb-6 hover:opacity-70 transition-all">
          <span className="mr-4 text-xl">+</span> Create New
        </Link>

        <section>
          <div className="mb-8">
            <h2 className="text-2xl text-gray-600 inline-block mr-2 font-medium">Scheduling</h2>
            <span className="text-gray-300 font-light">- Activities are waiting for scheduling.</span>
          </div>

          {/* 表頭 */}
          <div className="bg-gray-50 flex py-4 px-10 text-gray-400 font-medium rounded-t-2xl border-x border-t border-gray-100">
            <div className="flex-1 text-left">Event Title</div>
            <div className="w-32 text-center">Status</div>
            <div className="w-64 text-center">Actions</div>
          </div>

          {/* 列表內容 */}
          <div className="border-x border-gray-100">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event._id} className="flex items-center px-10 py-6 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  {/* 標題欄位 */}
                  <div className="flex-1 text-xl text-gray-700 font-normal">
                    {event.title}
                  </div>

                  {/* 狀態標籤 */}
                  <div className="w-32 flex justify-center">
                    <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#E2FDE8] text-[#73E58C]">
                      {event.status || 'Scheduling'}
                    </span>
                  </div>
                  
                  {/* 按鈕欄位 - 使用先前設計的漂亮樣式 */}
                  <div className="w-64 flex justify-end gap-3">
                    <button
                      onClick={() => navigate(`/edit-event/${event._id}`)}
                      className="bg-[#B8D4EE] text-gray-700 px-6 py-2 rounded-xl flex items-center gap-1 hover:bg-[#a5c5e4] transition-all text-sm font-medium"
                    >
                      Edit ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-[#F2B6B6] text-gray-700 px-6 py-2 rounded-xl flex items-center gap-1 hover:bg-[#e89a9a] transition-all text-sm font-medium"
                    >
                      Delete 🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-gray-300 text-xl border-b border-gray-100">
                There is no event.
              </div>
            )}
          </div>
          {/* The bottom of the list column */}
          <div className="bg-white border border-t-0 border-gray-100 py-3 flex justify-center text-gray-300 rounded-b-2xl shadow-sm"></div>
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-2xl text-gray-600 inline-block mr-2 font-medium">Publish</h2>
            <span className="text-gray-300 font-light">- Events are scheduled and published.</span>
          </div>

          {/* 表頭 */}
          <div className="bg-gray-50 flex py-4 px-10 text-gray-400 font-medium rounded-t-2xl border-x border-t border-gray-100">
            <div className="flex-1 text-left">Event Title</div>
            <div className="w-32 text-center">Status</div>
            <div className="w-64 text-center">Actions</div>
          </div>

          {/* 列表內容 */}
          <div className="border-x border-gray-100">
              <div className="py-20 text-center text-gray-300 text-xl border-b border-gray-100">
                There is no event.
              </div>    
          </div>
          {/* The bottom of the list column */}
          <div className="bg-white border border-t-0 border-gray-100 py-3 flex justify-center text-gray-300 rounded-b-2xl shadow-sm"></div>
        </section>
      </div>
    </div>
  );
};

export default ViewEvent;