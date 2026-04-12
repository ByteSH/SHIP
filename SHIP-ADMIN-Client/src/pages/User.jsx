import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, createUser, updateUser, deleteUser } from '../api/user';

const User = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('username'); // 'username', 'email', 'status', 'role'
  const [isFetching, setIsFetching] = useState(false);
  
  // Generic page level messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'create', 'details', 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal specific messages
  const [modalErrorMsg, setModalErrorMsg] = useState('');

  const loadAllUsers = async () => {
    setIsFetching(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await getAllUsers();
      setAllUsers(data);
    } catch (err) {
      setErrorMsg(err.message || 'Error fetching users list.');
      setAllUsers([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ username: '', password: '', email: '', phoneNumber: '' });
    setActiveModal('create');
    setModalErrorMsg('');
  };

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setActiveModal('details');
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'USER',
      status: user.status || 'ACTIVE',
      passwordExpiry: user.passwordExpiry || ''
    });
    setActiveModal('edit');
    setModalErrorMsg('');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setModalErrorMsg('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalErrorMsg('');
    try {
      await createUser(formData);
      setSuccessMsg(`User ${formData.username} created successfully!`);
      setActiveModal(null);
      loadAllUsers(); // Reload to get newly created user
    } catch (err) {
      // Show error INSIDE the modal window!
      setModalErrorMsg(err.message || 'Error creating user. Check username or password rules.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalErrorMsg('');
    try {
      const payloadData = {
        email: formData.email,
        phoneNumber: Number(formData.phoneNumber),
        role: formData.role,
        status: formData.status,
        passwordExpiry: formData.passwordExpiry
      };
      const updatedUser = await updateUser(selectedUser.username, payloadData);
      setSuccessMsg('User updated successfully!');
      setAllUsers(prev => prev.map(u => u.username === selectedUser.username ? updatedUser : u));
      setActiveModal(null);
    } catch (err) {
      // Show error INSIDE the modal window!
      setModalErrorMsg(err.message || 'Error updating user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you extremely sure you want to permanently delete Admin user: "${user.username}"?`)) {
      try {
        await deleteUser(user.username);
        setSuccessMsg(`Admin user '${user.username}' deleted successfully.`);
        setAllUsers(prev => prev.filter(u => u.username !== user.username));
      } catch (err) {
        setErrorMsg(err.message || `Error deleting user '${user.username}'.`);
      }
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'ACTIVE') return { bg: '#E1FCEF', color: '#05CD99' };
    if (status === 'BLOCKED') return { bg: '#FFE8E8', color: '#EE5D50' };
    if (status === 'LOCKED') return { bg: '#FFF4E5', color: '#FF9800' };
    if (status === 'EXPIRED') return { bg: '#E2E8F0', color: '#475569' };
    return { bg: '#F4F7FE', color: '#A3AED0' };
  };

  // Locally filter array based on selected field
  const displayedUsers = allUsers.filter(user => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    switch (filterType) {
      case 'username': return user.username?.toLowerCase().includes(q);
      case 'email': return user.email?.toLowerCase().includes(q);
      case 'status': return user.status?.toLowerCase().includes(q);
      case 'role': return user.role?.toLowerCase().includes(q);
      default: return true;
    }
  });

  const thStyle = { fontSize: '0.75rem', color: '#A3AED0', backgroundColor: '#F4F7FE', padding: '0.8rem 1rem', borderBottom: '2px solid #E9EDF7', whiteSpace: 'nowrap' };
  const tdStyle = { color: '#2B3674', fontWeight: '600', fontSize: '0.85rem', verticalAlign: 'middle', padding: '0.8rem 1rem' };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 overflow-hidden" style={{ backgroundColor: '#F4F7FE', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {/* Modals */}
      {activeModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}>
          <div className="card shadow border-0 overflow-hidden" style={{ width: '95%', maxWidth: '600px', borderRadius: '20px', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex justify-content-between p-3 border-bottom align-items-center">
                <h5 className="fw-bold m-0" style={{ color: '#2B3674' }}>
                    {activeModal === 'create' ? 'Create New User' : activeModal === 'edit' ? 'Edit User Parameters' : 'User Details Overview'}
                </h5>
                <button className="btn btn-sm border-0 d-flex align-items-center justify-content-center" onClick={handleCloseModal} style={{ backgroundColor: '#F4F7FE', borderRadius: '50%', width: '32px', height: '32px' }}>
                    <i className="bi bi-x-lg" style={{ color: '#4318FF', fontSize: '1rem', fontWeight: 'bold' }}></i>
                </button>
            </div>

            <div className="p-4" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                {modalErrorMsg && <div className="alert alert-danger py-2 px-3 mb-3 small" style={{ borderRadius: '10px' }}>{modalErrorMsg}</div>}
                {activeModal === 'create' && (
                    <form onSubmit={handleSubmitCreate}>
                       <div className="row g-3">
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Username</label>
                              <input type="text" name="username" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.username} onChange={handleChange} required/>
                          </div>
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Password</label>
                              <input type="password" name="password" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.password} onChange={handleChange} required/>
                          </div>
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Email</label>
                              <input type="email" name="email" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.email} onChange={handleChange} required/>
                          </div>
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Phone Number</label>
                              <input type="text" name="phoneNumber" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.phoneNumber} onChange={handleChange} required/>
                          </div>
                          <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                              <button type="button" className="btn px-4 bg-light shadow-sm fw-bold border-0" style={{ color: '#2B3674', borderRadius: '10px' }} onClick={handleCloseModal}>Cancel</button>
                              <button type="submit" className="btn px-4 shadow-sm fw-bold" style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '10px' }} disabled={isSubmitting}>
                                  {isSubmitting ? 'Creating...' : 'Create User'}
                              </button>
                          </div>
                       </div>
                    </form>
                )}
                {activeModal === 'edit' && selectedUser && (
                    <form onSubmit={handleSubmitEdit}>
                       <div className="row g-3">
                          <div className="col-sm-12">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Username (Immutable)</label>
                              <input type="text" className="form-control" style={{ backgroundColor: '#E9EDF7', border: 'none', borderRadius: '10px', fontSize: '0.85rem', color: '#A3AED0' }} value={selectedUser.username} readOnly />
                          </div>
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Email</label>
                              <input type="email" name="email" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.email} onChange={handleChange} required/>
                          </div>
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Phone Number</label>
                              <input type="text" name="phoneNumber" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.phoneNumber} onChange={handleChange} required/>
                          </div>
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Role</label>
                              <select name="role" className="form-select" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem', color: '#2B3674' }} value={formData.role} onChange={handleChange}>
                                  <option value="USER">USER</option>
                                  <option value="ADMIN">ADMIN</option>
                              </select>
                          </div>
                          <div className="col-sm-6">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Status</label>
                              <select name="status" className="form-select" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem', color: '#2B3674' }} value={formData.status} onChange={handleChange}>
                                  <option value="ACTIVE">ACTIVE</option>
                                  <option value="LOCKED">LOCKED</option>
                                  <option value="EXPIRED">EXPIRED</option>
                                  <option value="BLOCKED">BLOCKED</option>
                              </select>
                          </div>
                          <div className="col-sm-12">
                              <label className="fw-bold mb-1" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Password Expiry Config (Optional YYYY-MM-DD HH:MM:SS)</label>
                              <input type="text" name="passwordExpiry" className="form-control" style={{ backgroundColor: '#F4F7FE', border: 'none', borderRadius: '10px', fontSize: '0.85rem' }} value={formData.passwordExpiry || ''} onChange={handleChange} />
                          </div>
                          <div className="col-12 d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                              <button type="button" className="btn px-4 bg-light shadow-sm fw-bold border-0" style={{ color: '#2B3674', borderRadius: '10px' }} onClick={handleCloseModal}>Cancel Edit</button>
                              <button type="submit" className="btn px-4 shadow-sm fw-bold" style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '10px' }} disabled={isSubmitting}>
                                  {isSubmitting ? 'Saving Output...' : 'Save Data Package'}
                              </button>
                          </div>
                       </div>
                    </form>
                )}
                {activeModal === 'details' && selectedUser && (
                    <div className="row g-4">
                        {[
                            { label: 'Username', val: selectedUser.username },
                            { label: 'Email', val: selectedUser.email },
                            { label: 'Phone Number', val: selectedUser.phoneNumber },
                            { label: 'Role', val: selectedUser.role },
                            { label: 'Status', val: selectedUser.status, isBadge: true },
                            { label: 'Password Expiry', val: selectedUser.passwordExpiry },
                            { label: 'Failed Login Attempts', val: selectedUser.failedAttempts },
                            { label: 'Account Locked Time', val: selectedUser.lockTime },
                            { label: 'Last Login', val: selectedUser.lastLogin },
                            { label: 'Account Created', val: selectedUser.createdAt },
                            { label: 'Last Updated', val: selectedUser.updatedAt }
                        ].map((item, idx) => (
                            <div className="col-sm-6" key={idx}>
                                <p className="m-0 text-uppercase fw-bold" style={{ fontSize: '0.65rem', color: '#A3AED0' }}>{item.label}</p>
                                {item.isBadge ? (
                                   <span className="badge rounded-pill mt-1" style={{ fontSize: '0.7rem', backgroundColor: getStatusStyle(item.val).bg, color: getStatusStyle(item.val).color }}>
                                       {item.val || '-'}
                                   </span>
                                ) : (
                                   <div className="m-0 pt-1" style={{ fontSize: '0.90rem', color: '#2B3674', borderBottom: '1px solid #E9EDF7', paddingBottom: '0.3rem', fontWeight: '500', wordWrap: 'break-word', whiteSpace: 'normal' }}>{item.val || '-'}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Main Page Layout */}
      <div
          className="card border-0 d-flex flex-column shadow-sm"
          style={{
              width: '98%',
              maxWidth: '1200px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.2rem',
              maxHeight: '95vh',
              overflow: 'hidden'
          }}
      >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 flex-shrink-0 gap-3">
              <div className="d-flex align-items-center">
                  <button
                      type="button"
                      className="btn rounded-circle d-flex justify-content-center align-items-center border-0 me-3"
                      onClick={() => navigate('/dashboard')}
                      style={{ width: '38px', height: '38px', backgroundColor: '#F4F7FE' }}
                  >
                      <i className="bi bi-arrow-left" style={{ color: '#4318FF', fontSize: '1.1rem', fontWeight: 'bold' }}></i>
                  </button>
                  <div>
                      <h4 className="fw-bold m-0" style={{ color: '#2B3674', fontSize: '1.3rem' }}>User Directory</h4>
                      <p className="m-0 mt-1" style={{ fontSize: '0.8rem', color: '#A3AED0', fontWeight: '500' }}>Manage access profiles</p>
                  </div>
              </div>

              <div className="d-flex align-items-center flex-wrap gap-3 justify-content-end">
                  <div className="d-flex align-items-center m-0 gap-2">
                      <select 
                          className="form-select shadow-sm" 
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          style={{
                              backgroundColor: '#F4F7FE',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '0.5rem 0.8rem',
                              fontSize: '0.85rem',
                              color: '#2B3674',
                              width: '160px',
                              fontWeight: 'bold'
                          }}
                      >
                          <option value="username">Username</option>
                          <option value="email">Email ID</option>
                          <option value="status">Status</option>
                          <option value="role">Role</option>
                      </select>

                      <input
                          type="text"
                          className="form-control shadow-sm"
                          placeholder={`Filter by ${filterType}...`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                              backgroundColor: '#F4F7FE',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.85rem',
                              color: '#2B3674',
                              minWidth: '220px'
                          }}
                      />
                  </div>

                  <div style={{ width: '2px', height: '30px', backgroundColor: '#E9EDF7', margin: '0 5px' }}></div>
                  <button
                      className="btn d-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm"
                      onClick={loadAllUsers}
                      disabled={isFetching}
                      style={{ backgroundColor: '#F4F7FE', color: '#4318FF', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                      <i className={`bi bi-arrow-clockwise ${isFetching ? 'spin' : ''}`}></i> Refresh
                  </button>
                  <button
                      className="btn d-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm"
                      onClick={handleOpenCreate}
                      style={{ backgroundColor: '#4318FF', color: 'white', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                      <i className="bi bi-person-plus-fill text-white"></i> Add User
                  </button>
              </div>
          </div>

          {errorMsg && <div className="alert alert-danger text-center py-1 px-3 mb-2 small" style={{ borderRadius: '10px' }}>{errorMsg}</div>}
          {successMsg && <div className="alert alert-success text-center py-1 px-3 mb-2 small" style={{ borderRadius: '10px' }}>{successMsg}</div>}

          {isFetching ? (
              <div className="d-flex flex-grow-1 justify-content-center align-items-center">
                  <div className="spinner-border" style={{ color: '#4318FF' }} role="status">
                      <span className="visually-hidden">Loading...</span>
                  </div>
              </div>
          ) : displayedUsers.length > 0 ? (
              <div className="d-flex flex-column flex-grow-1 overflow-hidden mt-1">
                  <div className="table-responsive flex-grow-1" style={{ borderRadius: '12px', border: '1px solid #E9EDF7' }}>
                      <table className="table table-hover mb-0 align-middle">
                          <thead style={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#F4F7FE' }}>
                              <tr>
                                  <th style={{ ...thStyle, paddingLeft: '1rem' }}>Username</th>
                                  <th style={thStyle}>Email</th>
                                  <th style={thStyle}>Phone Number</th>
                                  <th style={thStyle}>Role</th>
                                  <th style={thStyle}>Status</th>
                                  <th style={{ ...thStyle, paddingRight: '1rem' }}>Action</th>
                              </tr>
                          </thead>
                          <tbody style={{ borderTop: 'none' }}>
                              {displayedUsers.map((user, idx) => (
                                  <tr key={idx}>
                                      <td className="text-truncate" style={{ ...tdStyle, paddingLeft: '1rem', maxWidth: '150px' }}>{user.username}</td>
                                      <td className="text-truncate" style={{ ...tdStyle, maxWidth: '200px' }}>{user.email}</td>
                                      <td style={tdStyle}>{user.phoneNumber}</td>
                                      <td style={tdStyle}>{user.role}</td>
                                      <td style={tdStyle}>
                                          <span className="badge rounded-pill px-2 py-1" style={{ fontSize: '0.7rem', backgroundColor: getStatusStyle(user.status).bg, color: getStatusStyle(user.status).color }}>
                                              {user.status || '-'}
                                          </span>
                                      </td>
                                      <td style={{ ...tdStyle, paddingRight: '1rem' }}>
                                          <div className="d-flex gap-2 justify-content-start flex-wrap">
                                              <button
                                                  onClick={() => handleOpenDetails(user)}
                                                  className="btn btn-sm d-flex align-items-center justify-content-center"
                                                  title="View Details"
                                                  style={{ backgroundColor: '#4318FF', color: '#FFF', fontSize: '0.75rem', borderRadius: '8px', minWidth: '60px' }}>
                                                  Details
                                              </button>
                                              <button
                                                  onClick={() => handleOpenEdit(user)}
                                                  className="btn btn-sm d-flex align-items-center justify-content-center"
                                                  style={{ backgroundColor: '#2B3674', color: '#FFF', fontSize: '0.75rem', borderRadius: '8px' }}
                                                  title={`Edit ${user.username}`}>
                                                  <i className="bi bi-pencil-fill"></i>
                                              </button>
                                              <button
                                                  onClick={() => handleDeleteUser(user)}
                                                  className="btn btn-sm d-flex align-items-center justify-content-center"
                                                  style={{ backgroundColor: '#E31A1A', color: '#FFF', fontSize: '0.75rem', borderRadius: '8px' }}
                                                  title={`Delete ${user.username}`}>
                                                  <i className="bi bi-trash-fill"></i>
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          ) : (
              <div className="d-flex flex-grow-1 justify-content-center align-items-center flex-column text-center h-100">
                  <i className="bi bi-person-x mb-3" style={{ fontSize: '3.5rem', color: '#E9EDF7' }}></i>
                  <p style={{ color: '#A3AED0', fontWeight: '500' }}>No users match the current filter.<br />Adjust your search or add a new user.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default User;
