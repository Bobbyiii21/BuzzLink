const mongoose = require('mongoose')

const Schema = mongoose.Schema

const roomSchema = new Schema({
    roomName: {
        type: String, 
        required: true
    }, 
    roomType: {
        type: String,
        required: true
    },
    participantLimit: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
        required: false
    },
    participants: { 
        type: [{ type: mongoose.Schema.ObjectId, ref: 'Users'}],
        required: true 
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    }
}, { timestamps: true }, {collection: "Rooms"})

module.exports = mongoose.model('Room', roomSchema)