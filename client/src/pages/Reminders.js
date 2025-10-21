import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Reminders = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'Once Daily',
    startDate: '',
    endDate: '',
    times: ['08:00'],
    notes: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const frequencies = [
    'Once Daily',
    'Twice Daily', 
    'Three Times Daily',
    'Four Times Daily',
    'Every 8 Hours',
    'Every 12 Hours',
    'As Needed',
    'Weekly'
  ];

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle both array and object responses
      const remindersData = response.data.data || response.data;
      setReminders(Array.isArray(remindersData) ? remindersData : []);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch reminders');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFrequencyChange = (e) => {
    const frequency = e.target.value;
    let defaultTimes = ['08:00'];
    
    switch(frequency) {
      case 'Twice Daily':
        defaultTimes = ['08:00', '20:00'];
        break;
      case 'Three Times Daily':
        defaultTimes = ['08:00', '14:00', '20:00'];
        break;
      case 'Four Times Daily':
        defaultTimes = ['08:00', '12:00', '16:00', '20:00'];
        break;
      case 'Every 8 Hours':
        defaultTimes = ['08:00', '16:00', '00:00'];
        break;
      case 'Every 12 Hours':
        defaultTimes = ['08:00', '20:00'];
        break;
      default:
        defaultTimes = ['08:00'];
    }

    setFormData({
      ...formData,
      frequency: frequency,
      times: defaultTimes
    });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({
      ...formData,
      times: newTimes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/reminders', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Medication reminder added successfully!');
      setFormData({
        medicineName: '',
        dosage: '',
        frequency: 'Once Daily',
        startDate: '',
        endDate: '',
        times: ['08:00'],
        notes: ''
      });
      fetchReminders();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add reminder');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (reminderId) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/reminders/${reminderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Reminder deleted successfully!');
        fetchReminders();
      } catch (error) {
        setError('Failed to delete reminder');
      }
    }
  };

  const toggleReminderStatus = async (reminderId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/reminders/${reminderId}`, {
        isActive: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReminders();
    } catch (error) {
      setError('Failed to update reminder status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getNextDose = (times) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (let time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;
      
      if (timeInMinutes > currentTime) {
        return time;
      }
    }
    
    return times[0] + ' (tomorrow)';
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">Loading reminders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1>Medicine Reminders</h1>
        <p>Set up and manage your medication reminders.</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Add Reminder Form */}
        <div className="form-section">
          <h2>Add New Reminder</h2>
          <form onSubmit={handleSubmit} className="reminder-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="medicineName">Medicine Name *</label>
                <input
                  type="text"
                  id="medicineName"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Aspirin"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dosage">Dosage *</label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 100mg, 1 tablet"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="frequency">Frequency *</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleFrequencyChange}
                  required
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reminder Times</label>
                <div className="times-grid">
                  {formData.times.map((time, index) => (
                    <input
                      key={index}
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      required
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional instructions or notes..."
                rows="2"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isAdding}
            >
              {isAdding ? 'Adding...' : 'Add Reminder'}
            </button>
          </form>
        </div>

        {/* Reminders List */}
        <div className="reminders-section">
          <h2>Your Medication Reminders ({reminders.length})</h2>
          
          {!Array.isArray(reminders) || reminders.length === 0 ? (
            <div className="no-reminders">
              <p>No medication reminders set up yet.</p>
              <p>Add your first reminder using the form above.</p>
            </div>
          ) : (
            <div className="reminders-grid">
              {Array.isArray(reminders) && reminders.map(reminder => (
                <div key={reminder._id} className={`reminder-card ${!reminder.isActive ? 'inactive' : ''}`}>
                  <div className="reminder-header">
                    <h3>{reminder.medicineName}</h3>
                    <div className="reminder-controls">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={reminder.isActive}
                          onChange={() => toggleReminderStatus(reminder._id, reminder.isActive)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="reminder-details">
                    <p><strong>Dosage:</strong> {reminder.dosage}</p>
                    <p><strong>Frequency:</strong> {reminder.frequency}</p>
                    <p><strong>Times:</strong> {reminder.times.join(', ')}</p>
                    <p><strong>Next Dose:</strong> {getNextDose(reminder.times)}</p>
                    <p><strong>Duration:</strong> {formatDate(reminder.startDate)} 
                      {reminder.endDate && ` - ${formatDate(reminder.endDate)}`}
                    </p>
                    {reminder.notes && (
                      <p><strong>Notes:</strong> {reminder.notes}</p>
                    )}
                  </div>

                  <div className="reminder-actions">
                    <span className={`status ${reminder.isActive ? 'active' : 'inactive'}`}>
                      {reminder.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;