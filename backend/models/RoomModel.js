const mongoose = require('mongoose')
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
        required: true
    }, 
    participantList: {
        type: [userSchema]
    }
}, { timestamps: true }, {collection: "Rooms"})

module.exports = mongoose.model('Room', roomSchema)