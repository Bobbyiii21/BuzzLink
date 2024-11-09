import React from 'react';
import '../pages/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

export function RoomGrid({rooms}) {

    // Function to handle the join button click
    const handleJoin = (roomName) => {
        alert(`You have joined the room: ${roomName}`);
    };

    return (
        <>
            <div className="room-grid">
                {rooms.map((room) => (
                    <div key={room._id} className="room-card">
                        <div className="room-card-header">
                            <div className="participant-count">
                                <div className="participant-icon-container">
                                    <FontAwesomeIcon icon={faUser} className="participant-icon" />
                                    <span className="participant-number">{room.participantList.length}+</span>
                                </div>
                            </div>
                            <div>
                              {room.locked ? <FontAwesomeIcon icon={faLock} className="lock-icon"/> : <></>}
                            </div>
                        </div>
                      <div className="room-tag-container">
                        <div className="room-tag">
                          {room.roomType}
                        </div>
                      </div>
                        <div className="room-card-footer">
                            <p className="room-name">{room.roomName}</p>
                            <button
                                className="join-room-button"
                                onClick={() => handleJoin(room.roomName)}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default RoomGrid;