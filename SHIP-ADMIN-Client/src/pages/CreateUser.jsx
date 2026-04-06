import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/user';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await createUser(formData);
      setSuccessMsg(`User ${formData.username} created successfully! Redirecting...`);
      // Redirect to dashboard after brief delay to show success msg
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      if (error.message) {
        setErrorMsg(error.message); // Will display the conflict message e.g. "Username already exists."
      } else {
        setErrorMsg('An error occurred while creating the user.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 overflow-hidden" style={{ backgroundColor: '#F4F7FE', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div 
        className="card border-0 d-flex flex-column h-90 justify-content-center" 
        style={{ 
          width: '90%', 
          maxWidth: '550px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '2rem 2.5rem',
          boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.08)',
          maxHeight: '90vh'
        }}
      >
        <div className="d-flex align-items-center mb-4">
          <button 
            type="button" 
            className="btn rounded-circle d-flex justify-content-center align-items-center border-0 me-3 flex-shrink-0" 
            onClick={() => navigate('/dashboard')}
            style={{ width: '40px', height: '40px', backgroundColor: '#F4F7FE' }}
          >
            <i className="bi bi-arrow-left" style={{ color: '#4318FF', fontSize: '1.2rem', fontWeight: 'bold' }}></i>
          </button>
          <div>
            <h4 className="fw-bold m-0" style={{ color: '#2B3674' }}>Create User</h4>
            <p className="m-0 mt-1" style={{ fontSize: '0.8rem', color: '#A3AED0', fontWeight: '500' }}>Add a new user to the portal</p>
          </div>
        </div>
        
        {successMsg && <div className="alert alert-success text-center py-2 mb-3" style={{ borderRadius: '12px', fontSize: '0.9rem' }}>{successMsg}</div>}
        {errorMsg && <div className="alert alert-danger text-center py-2 mb-3" style={{ borderRadius: '12px', fontSize: '0.9rem' }}>{errorMsg}</div>}

        <form onSubmit={handleCreateUser} className="overflow-auto pe-2" style={{ maxHeight: '100%' }}>
          <div className="mb-3">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#2B3674' }}>Username</label>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="e.g. hamzash"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ 
                backgroundColor: '#F4F7FE', 
                border: 'none', 
                borderRadius: '16px', 
                padding: '0.8rem 1rem',
                fontSize: '0.95rem',
                color: '#2B3674'
              }}
            />
          </div>

          <div className="d-flex flex-column flex-md-row gap-md-3">
            <div className="w-100 mb-3">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#2B3674' }}>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. user@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ 
                  backgroundColor: '#F4F7FE', 
                  border: 'none', 
                  borderRadius: '16px', 
                  padding: '0.8rem 1rem',
                  fontSize: '0.95rem',
                  color: '#2B3674'
                }}
              />
            </div>
            
            <div className="w-100 mb-3">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#2B3674' }}>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                style={{ 
                  backgroundColor: '#F4F7FE', 
                  border: 'none', 
                  borderRadius: '16px', 
                  padding: '0.8rem 1rem',
                  fontSize: '0.95rem',
                  color: '#2B3674'
                }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#2B3674' }}>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ 
                backgroundColor: '#F4F7FE', 
                border: 'none', 
                borderRadius: '16px', 
                padding: '0.8rem 1rem',
                fontSize: '0.95rem',
                color: '#2B3674'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn w-100 py-2 fw-bold"
            style={{ 
              borderRadius: '16px', 
              backgroundColor: '#5D44FE', 
              color: '#FFFFFF',
              boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)',
              transition: 'all 0.3s ease',
              marginTop: 'auto'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</span>
            ) : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
