
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    capacity : {type: Number, required: true},
    organizer : {type: String, required: true},
    category : {type: String, required: true},
    ticketRequired  : {type: Boolean},
    ageRestriction  : {type: Boolean},
    suburb: {type: String, required: true},
    location: {type: String, required: true},
    expStartDate: { type: Date , required: true},
    expStartTime: { type: String , required: true},
    expFinDate: { type: Date , required: true},
    expFinTime: { type: String , required: true},
    description: { type: String },
    image: {
        data: Buffer,
        contentType: String
    },
    completed: { type: Boolean, default: false },
   
});

module.exports = mongoose.model('Event', eventSchema);

