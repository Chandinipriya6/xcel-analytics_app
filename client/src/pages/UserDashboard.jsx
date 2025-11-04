// src/pages/UserDashboard.jsx
import React, { useState } from 'react';
import './UserDashboard.css';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tableName: '',
    fileName: '',
    description: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    navigate('/analyze-file',{
      state:{
        file:formData.file,
        tableName: formData.tableName,
        fileName: formData.fileName,
        description: formData.description
      }
    }); //  Correct route
  };

  return (
    <div className="upload-container">
      <h2>Upload Excel File</h2>
      
      <form onSubmit={handleSubmit} className="upload-form">
        <label>Table Name*</label>
        <input
          type="text"
          name="tableName"
          value={formData.tableName}
          onChange={handleChange}
          required
        />

        <label>File Name:</label>
        <input
          type="text"
          name="fileName"
          value={formData.fileName}
          onChange={handleChange}
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <p className="file-type">File Type: <strong>.xlsx or .xls</strong></p>

        <label>Choose File:</label>
        <input
          type="file"
          name="file"
          accept=".xlsx,.xls"
          onChange={handleChange}
        />

        <div className="buttons">
          <button type="submit" className="next-btn">Next</button>
        </div>
      </form>
    </div>
  );
};

export default UserDashboard;
