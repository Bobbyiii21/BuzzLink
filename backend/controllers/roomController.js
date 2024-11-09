const Room = require('../models/RoomModel')
const mongoose = require('mongoose')

const getRoom = async (req, res) => {
  const {id} = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such room'})
  }

  const projection = {
    roomPassword: 0
  }

  const room = await Room.findById(id, projection )

  if (!room) {
    return res.status(404).json({error: 'No such room'})
  }
  res.status(200).json(room)
}

const getRooms = async (req, res) => {

  const projection = {
    roomPassword: 0
  }
  const rooms = await Room.find({}, projection).sort({createdAt: -1})

  if (!rooms) {
    return res.status(404).json({error: 'No such room'})
  }

  res.status(200).json(rooms)
}

const createRoom = async (req, res) => {


  const {roomName, roomType, participantLimit, roomPassword} = req.body


  if (participantLimit <= 0) {
    return res.status(400).json({error: 'participantLimit must be greater than 0'})
  }


  //add document to db
  try {
    const room = await Room.create({
      roomName,
      roomType,
      participantLimit,
      participantList: [],
      roomPassword,
      locked: roomPassword ? true : false
    })
    res.status(200).json(room)


  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const deleteRoom = async (req, res) => {
  const {id} = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such room'})
  }

  const room = await Room.findOneAndDelete({_id: id})

  if (!room) {
    return res.status(400).json({error: 'No such room'})
  }

  res.status(200).json(room)
}

const updateRoom = async (req, res) => {
  const {id} = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such room'})
  }

  const room = await Room.findOneAndUpdate({_id: id}, {
    ...req.body
  },)

  if (!room) {
    return res.status(400).json({error: 'No such room'})
  }

  const updatedRoom = await Room.findById(id)

  res.status(200).json(updatedRoom)
}

/**
 * filter and return rooms
 * @return rooms after filtering
 * <pre>
 * req.body = {
 *      low: number,
 *      up: number,
 *      roomType: string | undefined,
 *      showLocked: boolean
 * }
 * </pre>
 */
const filterRoom = async (req, res) => {
  let {low, up, roomType, showLocked} = req.body;

  const query = {
    $and: [
      { participantList: { $exists: true } },
      { $expr: {
          $and: [
            { $gte: [{ $size: "$participantList" }, low] },
            { $lte: [{ $size: "$participantList" }, up] }
          ]
        }}
    ]
  }

  if (!showLocked) {
    query.$and.push({
      roomPassword: {$exists: false}
    })
  }
  if (roomType) {
    query.roomType = roomType;
  }

  const projection = {
    roomPassword: 0
  }

  try {
    const rooms = await Room.find(query, projection);
    console.log(rooms);
    res.status(200).json(rooms);
  } catch (err) {
    console.log("Error when filtering rooms: ", err);
    res.status(400).send("Error when filtering rooms: ");
  }
}

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  deleteRoom,
  updateRoom,
  filterRoom,
}