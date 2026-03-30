/*Get Event Function (Read)*/

const Event = require('../models/Event');
const getEvents = async (req , res) => {
try{
const events = await Event.find ({userId: req.user.id});
res.json(events);
} catch (error) {
res.status(500).json({message: error.message});
}   
};

/*Add Event Function*/
const addEvent = async (req, res) => {
const{
    title, capacity, organizer, category, ticketRequired,
    ageRestriction, suburb, location, expStartDate, expStartTime,
    expFinDate,expFinTime, description, image
} = req.body;
try{
const event = await Event.create({
    userId: req.user.id,title, capacity, organizer, category, ticketRequired,
    ageRestriction, suburb, location, expStartDate, expStartTime,
    expFinDate,expFinTime, description, image
});
res.status(201).json(event); 
} catch (error) {
res.status(500).json({message: error.message});
}
};

/*Update Event*/
const updateEvent = async (req, res) =>{
const {
    title, capacity, organizer, category, ticketRequired,
    ageRestriction, suburb, location, expStartDate, expStartTime,
    expFinDate,expFinTime, description, image
} = req.body;
try{
const event = await Event.findById(req.params.id);
if (!event) return res.status(404).json({message: "Event not found"});

event.title = title || event.title;
event.capacity = capacity || event.capacity;
event.organizer = organizer || event.organizer;
event.category = category || event.category;
event.ticketRequired = ticketRequired || event.ticketRequired;
event.ageRestriction = ageRestriction || event.ageRestriction;
event.suburb = suburb || event.suburb;
event.location = location || event.location;
event.expStartDate = expStartDate || event.expStartDate;
event.expStartTime = expStartTime || event.expStartTime;
event.expFinDate = expFinDate || event.expFinDate;
event.expFinTime = expFinTime || event.expFinTime;
event.description = description || event.description;
event.image = image || event.image;

const updateEvent = await event.save();
res.json(updateEvent);
} catch (error){
res.status(500).json({message:error.message});
}
};

/*Delete Event*/
const deleteEvent = async (req, res) =>{
try{
const event = await Event.findById(req.params.id);
if(! event) return res.status(404).json({message: "Event not found"});

await event.remove();
res.json({message: "Event deleted"});
} catch(error){
res.status(500).json({message:error.message});
}
};
module.exports={getEvents, addEvent, updateEvent, deleteEvent};