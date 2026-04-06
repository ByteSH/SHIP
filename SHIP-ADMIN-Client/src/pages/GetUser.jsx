import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../api/user';

const GetUser = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleFetchUser = async (e) => {
    if (e) e.preventDefault();
    if (!searchUsername.trim()) return;

    setIsFetching(true);
    setErrorMsg('');
    setUserData(null);

    try {
      const data = await getUser(searchUsername);
      setUserData(data);
    } catch (error) {
      setErrorMsg(error.message || 'Error fetching user details.');
    } finally {
      setIsFetching(false);
    }
  };

  const displayData = userData || {
    username: '-',
    email: '-',
    phoneNumber: '-',
    role: '-',
    status: '-',
    failedAttempts: '-',
    lastLogin: '-',
    lockTime: '-',
    passwordExpiry: '-',
    createdAt: '-',
    updatedAt: '-' 
  };

  const getStatusStyle = (status) => {
    if (status === 'ACTIVE') return { bg: '#E1FCEF', color: '#05CD99' };
    if (status === 'BLOCKED') return { bg: '#FFE8E8', color: '#EE5D50' };
    if (status === 'LOCKED') return { bg: '#FFF4E5', color: '#FF9800' };
    if (status === 'EXPIRED') return { bg: '#E2E8F0', color: '#475569' };
    if (status === '-') return { bg: '#F4F7FE', color: '#A3AED0' };
    return { bg: '#F4F7FE', color: '#4318FF' };
  };

  const statusStyle = getStatusStyle(displayData.status);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 overflow-hidden" style={{ backgroundColor: '#F4F7FE', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div 
        className="card border-0 d-flex flex-column justify-content-between shadow-sm" 
        style={{ 
          width: '95%', 
          maxWidth: '900px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '20px', 
          padding: '2rem',
          maxHeight: '90vh',
          overflow: 'hidden'
        }}
      >
        {/* Header & Search inline to save vertical space */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 flex-shrink-0 gap-3">
          <div className="d-flex align-items-center">
            <button 
              type="button" 
              className="btn rounded-circle d-flex justify-content-center align-items-center border-0 me-3" 
              onClick={() => navigate('/dashboard')}
              style={{ width: '40px', height: '40px', backgroundColor: '#F4F7FE' }}
            >
              <i className="bi bi-arrow-left" style={{ color: '#4318FF', fontSize: '1.2rem', fontWeight: 'bold' }}></i>
            </button>
            <div>
              <h4 className="fw-bold m-0" style={{ color: '#2B3674', fontSize: '1.5rem' }}>User Profile</h4>
              <p className="m-0 mt-1" style={{ fontSize: '0.85rem', color: '#A3AED0', fontWeight: '500' }}>Search for user</p>
            </div>
          </div>

          <form onSubmit={handleFetchUser} className="d-flex align-items-center m-0">
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Enter username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                required
                style={{ 
                  backgroundColor: '#F4F7FE', 
                  border: 'none', 
                  borderRadius: '12px', 
                  padding: '0.6rem 1rem',
                  fontSize: '0.9rem',
                  color: '#2B3674',
                  minWidth: '220px'
                }}
              />
              <button 
                type="submit" 
                className="btn fw-bold px-4 flex-shrink-0"
                style={{ 
                  borderRadius: '12px', 
                  backgroundColor: '#5d44fe', 
                  color: '#FFFFFF',
                  fontSize: '0.9rem'
                }}
                disabled={isFetching}
              >
                {isFetching ? 'Fetching...' : 'Fetch User'}
              </button>
            </div>
          </form>
        </div>

        {errorMsg && <div className="alert alert-danger text-center py-2 px-3 mb-3 small" style={{ borderRadius: '10px' }}>{errorMsg}</div>}

        {/* The Always-Visible Fields Grid */}
        <div className="d-flex flex-column flex-grow-1 overflow-hidden justify-content-center">
          <div className="row g-3">
            
            {/* Row 1 */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Username</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.username}</div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Email</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.email}</div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Phone Number</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.phoneNumber}</div>
            </div>

            {/* Row 2 */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Role</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.role}</div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Status</label>
              <div className="d-flex align-items-center" style={{ height: '41px', padding: '0 0.8rem' }}>
                <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.8rem', backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                  {displayData.status}
                </span>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Password Expiry</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.passwordExpiry || '-'}</div>
            </div>

            {/* Row 3 */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Failed Login Attempts</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.failedAttempts}</div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Account Locked</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.lockTime || '-'}</div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Last Login Time</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.lastLogin || '-'}</div>
            </div>

            {/* Row 4 */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Account Created</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.createdAt}</div>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Last Updated</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.updatedAt || '-'}</div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default GetUser;
