import { useContext, useEffect, useState, useRef } from "react"
import { VisibilityContext } from "./VisibilityContext"
import './Components.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"

export function Chat({roomId}) {
    const {isVisible} = useContext(VisibilityContext);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socket = useRef(null);

    useEffect(() => {
        // Connect to WebSocket server with a unique endpoint based on roomId
        //socket.current = new WebSocket(`ws://localhost:8080/chatroom/${roomId}`);
        socket.current = new WebSocket(`ws://localhost:8080`);

        // Handle incoming messages
        socket.current.onmessage = async (event) => {
            if (event.data instanceof Blob) {
              // Convert Blob to string
              const text = await event.data.text();
              setMessages((prevMessages) => [...prevMessages, text]);
            } else {
              setMessages((prevMessages) => [...prevMessages, event.data]);
            }
        };

        // Clean up the WebSocket connection on component unmount
        return () => {
            socket.current.close();
        };
    }, [roomId]); // Reconnect if the roomId changes

    const sendMessage = () => {
        if (input) {
            // Send message through WebSocket
            //socket.current.send(JSON.stringify({ roomId, message: input }));
            socket.current.send(JSON.stringify({message: input}));
            setInput(''); // Clear input field
        }
    };

    return (
        <>
            {isVisible && 
            <div className="chat">
                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className="chat-message">
                            {JSON.parse(message).message}
                        </div>
                    ))}
                </div>
                <input 
                    className="chat-input" 
                    type = "text" 
                    placeholder="Type here"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="send-button" onClick={sendMessage}>
                    <FontAwesomeIcon icon={faArrowUp} size="2x"/>
                </button>
            </div>}
        </>
    )
}