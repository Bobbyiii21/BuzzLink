
const express = require('express')
const router = express.Router()
const {
    createRoom, 
    getRooms, 
    getRoom, 
    deleteRoom, 
    updateRoom, filterRoom
} = require('../controllers/roomController')

//GET all workouts
router.get('/', getRooms)

//GET a single workout
router.get('/:id', getRoom)

//POST a new workout
router.post('/', createRoom)

//DELETE a workout
router.delete('/:id', deleteRoom)

//UPDATE a workout
router.patch('/:id', updateRoom)

router.post('/filter', filterRoom)

module.exports = router
