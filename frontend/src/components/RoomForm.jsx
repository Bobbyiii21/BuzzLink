import React, { useState } from 'react';
import axios from 'axios';


const RoomForm = () => {
  const [formData, setFormData] = useState({
    roomName: '',
    roomType: '',
    participantLimit: '',
    participantList: [userSchema]
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
      const response = await axios.post('/room/create', formData);
      if (response.status === 200) {
        setSuccessMessage('Room created successfully!');
        setFormData({ roomName: '', roomType: '', participantLimit: '' });
      }
    } catch (err) {
      setError('Error creating room. Please try again.');
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
            <option value="">Select a type</option>
            <option value="Study">Study</option>
            <option value="Gaming">Gaming</option>
            <option value="Watch Party">Watch Party</option>
          </select>
        </div>

        <div>
          <label>Participant Limit (optional):</label>
          <input
            type="number"
            name="participantLimit"
            value={formData.participantLimit}
            onChange={handleChange}
            min="0"
          />
        </div>

        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default RoomForm;
