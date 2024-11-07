const mongoose = require('mongoose')
const User = require('./UserModel');

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
    locked: {
      type: Boolean,
      required: true,
    },
    participantList: {
        type: [Object],
        required: true
    },
    roomPassword: {
        type: String,
        required: false
    }
}, { timestamps: true }, {collection: "Rooms"})

module.exports = mongoose.model('Room', roomSchema)