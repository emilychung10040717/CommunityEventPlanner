import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';



const EventForm = ({ events, setEvents, editingEvent, setEditingEvent }) => {

  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', capacity: '', organizer : '', category: '', ticketRequired : '', ageRestriction : '', 
        suburb : '', location : '', expStartDate : '', expStartTime : '', expFinDate : '', expFinTime : '', description: '', image: ''});
  const fileInputRef = useRef(null);   {/*clear the field after update or add*/}

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
        title: '', capacity: '', organizer : '', category: '', ticketRequired : false, ageRestriction : false, 
        suburb : '', location : '', expStartDate : '', expStartTime : '', expFinDate : '', expFinTime : '', description: '', image: '' 
      });
    }
 

  }, [editingEvent]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const response = await axiosInstance.put(`/api/events/${editingEvent._id}`, formData, {      //0330 fix
          headers: { Authorization: `Bearer ${user.token}`,'Content-Type': 'multipart/form-data' },
        });
          alert("Event Updated!");
        setEvents(events.map((event) => (event._id === response.data._id ? response.data : event)));
      } else {
        const response = await axiosInstance.post('/api/events', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
          alert("Event added!");
        setEvents([...events, response.data]);
      }
      setEditingEvent(null);
      setFormData({ title: '', capacity: '', organizer : '', category: '', ticketRequired : '', ageRestriction : '', 
        suburb : '', location : '', expStartDate : '', expStartTime : '', expFinDate : '', expFinTime : '', description: '', image: '' });
    } catch (error) {
      alert('Failed to save event.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingEvent ? 'Edit event' : 'Add event'}</h1>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-1 font-medium">Title</label>
        <input
          id="title"
          type="text"
          placeholder="Enter the title of event"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="capacity" className="block mb-1 font-medium">Capacity</label>
        <input
          id="capacity"
          type="number"
          placeholder="Enter the maximum number of participants, e.g.: 100"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="organizer" className="block mb-1 font-medium">Organizer</label>
        <input
          id="organizer"
          type="text"
          value={formData.organizer}
          placeholder="Enter the organizer of the event"
          onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block mb-1 font-medium">Category</label>
        <input
          id="category"
          type="text"
          placeholder="Enter the category of the event"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          id="ticketRequired"
          type="checkbox"
          checked={formData.ticketRequired}
          onChange={(e) => setFormData({ ...formData, ticketRequired: e.target.checked })}
        />
      <label htmlFor="ticketRequired" className="font-medium">Ticket Required (if no, no need to click)</label>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          id="ageRestriction"
          type="checkbox"
          checked={formData.ageRestriction}
          onChange={(e) => setFormData({ ...formData, ageRestriction: e.target.checked })}
        />
        <label htmlFor="ageRestriction" className="font-medium">Age Restriction (18+) (if no, no need to click)</label>
      </div>

      <div className="mb-4">
        <label htmlFor="suburb" className="block mb-1 font-medium">Suburb</label>
        <input
          id="suburb"
          type="text"
          placeholder="Enter the suburb of the event"
          value={formData.suburb}
          onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block mb-1 font-medium">Location</label>
        <input
          id="location"
          type="text"
          placeholder="Enter the location of the event"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="expStartDate" className="block mb-1 font-medium">Expected Start Date</label>
        <input
          id="expStartDate"
          type="date"
          value={formData.expStartDate}
          onChange={(e) => setFormData({ ...formData, expStartDate: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="expStartTime" className="block mb-1 font-medium">Expected Start Time</label>
        <input
          id="expStartTime"
          type="time"
          value={formData.expStartTime}
          onChange={(e) => setFormData({ ...formData, expStartTime: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="expFinDate" className="block mb-1 font-medium">Expected Finish Date</label>
        <input
          id="expFinDate"
          type="date"
          value={formData.expFinDate}
          onChange={(e) => setFormData({ ...formData, expFinDate: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="expFinTime" className="block mb-1 font-medium">Expected Finish Time</label>
        <input
          id="expFinTime"
          type="time"
          value={formData.expFinTime}
          onChange={(e) => setFormData({ ...formData, expFinTime: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-1 font-medium">Description</label>
        <input
          id="description"
          type="text"
          placeholder="Enter mroe description for the event"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

       
      <div className="mb-4">
        <label htmlFor="image" className="block mb-1 font-medium">Upload Image</label>
        <input
          id="image"
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingEvent ? 'Update event' : 'Add event'}
      </button>
    </form>
  );
  
};


export default EventForm;


