import { Titlebar } from "../components/Titlebar"
import { ParticipantView } from "../components/ParticipantView"
import { Chat } from "../components/Chat"
import { BottomButtons } from "../components/BottomButtons"
import { VisibilityProvider } from "../components/VisibilityContext"
import './Meeting.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Meeting() {
    const [roomData, setRoomData] = useState(null)
    const [participants, setParticipants] = useState([])
    const { roomId } = useParams() 

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const response = await fetch(`http://localhost:8001/rooms/${roomId}`)
                const data = await response.json()
                setRoomData(data)
                setParticipants(data.participants || [])
            } catch (error) {
                console.error('Error fetching room data:', error)
            }
        }

        if (roomId) {
            fetchRoomData()
        }

        // Fetch room data every second
        const intervalId = setInterval(() => {
            if (roomId) {
                fetchRoomData()
            }
        }, 1000)

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)

    }, [roomId])

    /* Sample Room Participants
    const Krish = {displayName: "Krish"}
    const Sam = {displayName: "Sam"}
    const Josh = {displayName: "Josh"}

    var participants = [Krish, Sam, Josh, Krish, Sam, Krish, Krish, Sam, Josh, Krish, Sam, Josh, Krish, Sam, Josh, Krish, Krish, Josh, Sam, Josh, Krish] */

    return (
        <>
            <Titlebar></Titlebar>
            <main>
                <VisibilityProvider>
                    <div className="meeting">
                        <div className="participant-grid">
                            {participants.map((participant) => { 
                                    return (
                                        <ParticipantView participant={participant}/>
                                    )
                                })
                            }
                        </div>
                        <Chat roomId={roomId} />
                    </div>
                    <BottomButtons></BottomButtons>
                </VisibilityProvider>
            </main>
        </>
    )
  }

export default Meeting