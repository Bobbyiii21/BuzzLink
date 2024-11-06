import React, { useState } from 'react';
import axios from 'axios';
import './Components.css'


const RoomForm = () => {
  const [formData, setFormData] = useState({
    roomName: '',
    roomType: '',
    participantLimit: 0,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.roomName.trim()) {
      setError('Room name is required.');
      return false;
    }
    if (formData.participantLimit && isNaN(formData.participantLimit)) {
      setError('Participant limit must be a number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:8001/api/rooms', formData);
      if (response.status === 200) {
        setSuccessMessage('Room created successfully!');
        setFormData({ roomName: '', roomType: '', participantLimit: 0 });
      }
    } catch (err) {
        if (err.response) {
          // Server responded with a status other than 200 range
          console.error('Error response:', err.response);
          setError(`Error: ${err.response.data.message || 'Unable to create room.'}`);
        } else if (err.request) {
          // No response received from the server
          console.error('Error request:', err.request);
          setError('No response from server. Please check your network connection.');
        } else {
          // Something else happened during request setup
          console.error('Error message:', err.message);
          setError(`Request error: ${err.message}`);
        }
    }
  };

  return (
    <div className="room-form">
      <h2>Create a Room</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Room Name (required):</label>
          <input
            type="text"
            name="roomName"
            value={formData.roomName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Room Type:</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            required
          >
            <option value="Test">Test</option>
            <option value="Study">Study</option>
            <option value="Gaming">Gaming</option>
            <option value="Watch Party">Some other type</option>
          </select>
        </div>

        <div>
          <label>Participant Limit (optional):</label>
          <input
            type="number"
            name="participantLimit"
            value={formData.participantLimit}
            onChange={handleChange}
            min="1"
          />
        </div>

        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default RoomForm;
