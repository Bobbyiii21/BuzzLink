import React, { useEffect, useState } from "react";
import "../pages/Home.css";

const filterURL = "http://localhost:8001/api/rooms/filter";
export function FilterContainer({ onCreateRoom, setRooms }) {
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: "", // default: all types
    participants: "", // default: any number
    availability: "", // default: only public
  });

  const handleFilterChange = (filter, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [filter]: value,
    });
  };

  // when filter info changes, fetch room data from the server
  useEffect(() => {
    async function fetchNewRoom() {
      let range;
      if (!selectedFilters.participants) {
        range = ["0", "999"];
      } else {
        range = selectedFilters.participants.split("-");
      }
      const body = {
        low: Number(range[0]),
        up: Number(range[1]),
        roomType: selectedFilters.roomType
          ? selectedFilters.roomType
          : undefined,
        showLocked: selectedFilters.availability === "All",
      };
      try {
        const response = await fetch(filterURL, {
          body: JSON.stringify(body),
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
        });
        let rooms = await response.json();
        console.log(rooms);
        setRooms(rooms);
      } catch (err) {
        alert("Error when fetching room data from the server!");
        console.log(err);
      }
    }
    fetchNewRoom();
  }, [selectedFilters]);

  return (
    <div className="filter-container">
      <div className="filters-label">Filters:</div>
      <div className="filter-buttons">
        <select
          className="filter-button"
          value={selectedFilters.roomType}
          onChange={(e) => handleFilterChange("roomType", e.target.value)}
        >
          <option value="">Room Type</option>
          <option value="Club">Club</option>
          <option value="Class">Class</option>
          <option value="Seminar">Seminar</option>
          <option value="Test">Test</option>
        </select>
        <select
          className="filter-button"
          value={selectedFilters.participants}
          onChange={(e) => handleFilterChange("participants", e.target.value)}
        >
          <option value=""># Participants</option>
          <option value="1-10">1-10</option>
          <option value="11-20">11-20</option>
          <option value="21-999">21+</option>
        </select>
        <select
          className="filter-button"
          value={selectedFilters.availability}
          onChange={(e) => handleFilterChange("availability", e.target.value)}
        >
          <option value="">Availability</option>
          <option value="Public">Public</option>
          <option value="All">All</option>
        </select>
        <button className="add-filter-button">&#43;</button>
      </div>
      <button className="create-room-button" onClick={onCreateRoom}>
        Create Room <span className="plus-icon">&#43;</span>
      </button>
    </div>
  );
}

export default FilterContainer;
