const mongoose = require('mongoose')

const User = require('./UserModel');


const Schema = mongoose.Schema
const userSchema = require('./UserModel').schema

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
    },
    locked: {
      type: Boolean,
      required: true,
    },
    participantList: {
        type: [userSchema],
        required: true
    },
    roomPassword: {
        type: String,
        required: false
    }
}, { timestamps: true }, {collection: "Rooms"})

module.exports = mongoose.model('Room', roomSchema)