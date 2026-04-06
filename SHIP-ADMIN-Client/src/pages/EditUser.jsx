import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getUser, updateUser } from '../api/user';

function EditUser() {
  const { username: paramUsername } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialUsername = paramUsername || (location.state && location.state.username) || '';

  const [searchUsername, setSearchUsername] = useState(initialUsername);
  const [fetchedUsername, setFetchedUsername] = useState('');
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const searchInputRef = useRef(null);

  const fetchUserDetails = async (userToFetch) => {
    if (!userToFetch) return;
    setLoading(true);
    setError(null);
    setSuccessMsg('');
    
    try {
      const data = await getUser(userToFetch);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        role: data.role || 'USER',
        status: data.status || 'ACTIVE',
        passwordExpiry: data.passwordExpiry || '',
        failedAttempts: data.failedAttempts !== null ? data.failedAttempts : 0,
        lockTime: data.lockTime || '',
        lastLogin: data.lastLogin || '',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      });
      setFetchedUsername(userToFetch);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch user data. Please check the username.');
      setFormData(null);
      setFetchedUsername('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUsername) {
      fetchUserDetails(initialUsername);
    } else {
      if (searchInputRef.current) searchInputRef.current.focus();
    }
  }, [initialUsername]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      fetchUserDetails(searchUsername.trim());
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData) return;

    setError(null);
    setSuccessMsg('');
    setLoading(true);
    
    const updatePayload = {
      email: formData.email,
      phoneNumber: Number(formData.phoneNumber),
      role: formData.role,
      status: formData.status,
      passwordExpiry: formData.passwordExpiry
    };

    updateUser(fetchedUsername, updatePayload)
      .then(res => {
        setSuccessMsg(`User ${fetchedUsername} updated successfully!`);
        setFormData(null);
        setFetchedUsername('');
        setSearchUsername('');
        setLoading(false);
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to update user');
        setLoading(false);
      });
  };

  const displayData = formData || {
    username: '-', email: '-', phoneNumber: '-', role: '-', status: '-', passwordExpiry: '-',
    failedAttempts: '-', lockTime: '-', lastLogin: '-', createdAt: '-', updatedAt: '-'
  };
  const isEditable = !!formData;

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
              <h4 className="fw-bold m-0" style={{ color: '#2B3674', fontSize: '1.5rem' }}>Edit User</h4>
              <p className="m-0 mt-1" style={{ fontSize: '0.85rem', color: '#A3AED0', fontWeight: '500' }}>Fetch and modify user details</p>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="d-flex align-items-center m-0">
            <div className="d-flex gap-2">
              <input
                ref={searchInputRef}
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
                  backgroundColor: '#5D44FE', 
                  color: '#FFFFFF',
                  fontSize: '0.9rem'
                }}
                disabled={loading && !isEditable}
              >
                {loading && !isEditable ? 'Fetching...' : 'Fetch User'}
              </button>
            </div>
          </form>
        </div>

        {error && <div className="alert alert-danger text-center py-2 px-3 mb-3 small" style={{ borderRadius: '10px' }}>{error}</div>}
        {successMsg && <div className="alert alert-success text-center py-2 px-3 mb-3 small" style={{ borderRadius: '10px' }}>{successMsg}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1 overflow-hidden justify-content-center">
          <div className="row g-3">
            
            {/* Row 1 */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Username</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.username}</div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Email</label>
              {!isEditable ? (
                <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>-</div>
              ) : (
                <input type="email" name="email" className="form-control fw-bold" value={formData.email} onChange={handleChange} required style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #A3AED0', borderRadius: '12px' }} />
              )}
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Phone Number</label>
              {!isEditable ? (
                <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>-</div>
              ) : (
                <input name="phoneNumber" className="form-control fw-bold" value={formData.phoneNumber} onChange={handleChange} required style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #A3AED0', borderRadius: '12px' }} />
              )}
            </div>

            {/* Row 2 */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Role</label>
              {!isEditable ? (
                <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>-</div>
              ) : (
                <select name="role" className="form-select fw-bold" value={formData.role} onChange={handleChange} style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #A3AED0', borderRadius: '12px' }}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              )}
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Status</label>
              {!isEditable ? (
                <div className="d-flex align-items-center" style={{ height: '41px', padding: '0 0.8rem' }}>
                  <span className="badge rounded-pill px-3 py-2 fw-bold" style={{ fontSize: '0.8rem', backgroundColor: statusStyle.bg, color: statusStyle.color }}>-</span>
                </div>
              ) : (
                <select name="status" className="form-select fw-bold" value={formData.status} onChange={handleChange} style={{ fontSize: '0.95rem', color: statusStyle.color, backgroundColor: statusStyle.bg, border: 'none', borderRadius: '12px', padding: '0.7rem 1rem' }}>
                  <option value="ACTIVE" style={{ color: '#2B3674', backgroundColor: '#FFFFFF' }}>ACTIVE</option>
                  <option value="LOCKED" style={{ color: '#2B3674', backgroundColor: '#FFFFFF' }}>LOCKED</option>
                  <option value="EXPIRED" style={{ color: '#2B3674', backgroundColor: '#FFFFFF' }}>EXPIRED</option>
                  <option value="BLOCKED" style={{ color: '#2B3674', backgroundColor: '#FFFFFF' }}>BLOCKED</option>
                </select>
              )}
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Password Expiry</label>
              {!isEditable ? (
                <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>-</div>
              ) : (
                <input type="text" name="passwordExpiry" className="form-control fw-bold" value={formData.passwordExpiry || ''} onChange={handleChange} placeholder="YYYY-MM-DD HH:MM:SS" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#FFFFFF', border: '1px solid #A3AED0', borderRadius: '12px' }} />
              )}
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
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Last Login</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.lastLogin || '-'}</div>
            </div>

            {/* Row 4 and Submit*/}
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Account Created</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.createdAt}</div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Last Updated</label>
              <div className="fw-bold text-truncate" style={{ fontSize: '0.95rem', color: '#2B3674', padding: '0.7rem 1rem', backgroundColor: '#F4F7FE', borderRadius: '12px' }}>{displayData.updatedAt || '-'}</div>
            </div>
            
            {/* Submit Button in the same grid row to save space */}
            <div className="col-12 col-md-4 d-flex align-items-end justify-content-end">
              <button 
                type="submit" 
                className="btn fw-bold px-4 w-100"
                style={{ 
                  borderRadius: '12px', 
                  backgroundColor: isEditable ? '#5D44FE' : '#E2E8F0', 
                  color: isEditable ? '#FFFFFF' : '#A3AED0',
                  fontSize: '1rem',
                  padding: '0.7rem 1rem',
                  transition: 'background-color 0.2s'
                }}
                disabled={!isEditable || loading}
              >
                {loading && isEditable ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                Save Changes
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;