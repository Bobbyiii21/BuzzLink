import React, {useState} from 'react';
import { HomeTitleBar } from '../home-components/HomeTitleBar';
import { FilterContainer } from '../home-components/FilterContainer';
import { RoomGrid } from '../home-components/RoomGrid';
import './Home.css';


function Home() {
    // Function to handle the creation of a new room
    const handleCreateRoom = () => {
        alert("implement room creation");
    };

  const [rooms, setRooms] = useState([]);

    return (
        <>
            <HomeTitleBar />
            <main>
                <div className="homepage">
                    <FilterContainer onCreateRoom={handleCreateRoom} setRooms={setRooms} />
                    <RoomGrid rooms={rooms} />
                </div>
            </main>
        </>
    );
}

export default Home;
