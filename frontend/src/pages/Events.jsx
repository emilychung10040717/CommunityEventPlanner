import { useState, useEffect} from 'react';
import axiosInstance from '../axiosConfig';
import EventForm from '../components/EventForm';
import EventList from '../components/EventList';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);


  return (
    <div className="container mx-auto p-6">
      <EventForm
        events={events}
        setEvents={setEvents}
        editingEvent={null}
        setEditingEvent={()=>{}}
      />
      {/* <EventList events={events} setEvents={setEvents} setEditingEvent={setEditingEvent} />  */}
    </div>
  );
};

export default Events;



