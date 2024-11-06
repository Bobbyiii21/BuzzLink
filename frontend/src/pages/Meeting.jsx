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
                const response = await fetch(`http://localhost:8001/api/rooms/${roomId}`)
                const data = await response.json()
                setRoomData(data)
                setParticipants(data.participantList || [])
            } catch (error) {
                console.error('Error fetching room data:', error)
            }
        }

        if (roomId) {
            fetchRoomData()
        }

        // Fetch room data every 3 seconds
        const intervalId = setInterval(() => {
            if (roomId) {
                fetchRoomData()
            }
        }, 3000)

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)

    }, [roomId])

    return (
        <>
            <Titlebar></Titlebar>
            <main>
                <VisibilityProvider>
                    <div className="meeting">
                        <div className="participant-grid">
                            {participants.map((participant, index) => { 
                                    return (
                                        <ParticipantView key={index} participant={participant}/>
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