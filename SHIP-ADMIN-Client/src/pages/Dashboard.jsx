import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ship_admin_token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ship_admin_token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="vh-100 d-flex flex-column overflow-hidden" style={{ backgroundColor: '#F4F7FE', padding: '0.5rem 2rem', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>

      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-shrink-0">
        <div>
          <h3 className="fw-bold m-0" style={{ color: '#2B3674' }}>SHIP-Admin</h3>
        </div>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn rounded-circle d-flex justify-content-center align-items-center border-0"
            style={{ width: '42px', height: '42px', backgroundColor: '#FFFFFF', boxShadow: '0px 4px 14px rgba(112, 144, 176, 0.12)' }}
          >
            <i className="bi bi-bell-fill" style={{ color: '#A3AED0' }}></i>
          </button>
          <button
            onClick={handleLogout}
            className="btn fw-bold border-0"
            style={{ padding: '0.7rem 1rem', backgroundColor: '#FFF0F0', color: '#E31A1A', borderRadius: '14px' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row flex-grow-1 overflow-hidden gap-3 pb-2 w-100">
        {/* Left Operations Sidebar */}
        <div className="col-12 col-md-5 col-lg-3 p-0 h-md-100">
          <div
            className="p-4 d-flex flex-column h-100 overflow-auto"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.08)'
            }}
          >
            {/* Operations Title */}
            <h6 className="fw-bold mb-4" style={{ color: '#2B3674', fontSize: '0.95rem' }}>Operations</h6>

            {/* Operations Grid Area */}
            <div className="row g-3 mb-4">
              {/* Manage Users Button */}
              <div className="col-6">
                <div
                  className="d-flex flex-column align-items-center justify-content-center w-100"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E9EDF7',
                    borderRadius: '20px',
                    height: '100px',
                    transition: 'all 0.3s ease',
                    transform: isHovered === 'manageUsers' ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered === 'manageUsers' ? '0px 12px 25px rgba(112, 144, 176, 0.15)' : '0px 4px 10px rgba(112, 144, 176, 0.05)'
                  }}
                  onClick={() => navigate('/user')}
                  onMouseEnter={() => setIsHovered('manageUsers')}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="rounded-circle mb-2 d-flex justify-content-center align-items-center" style={{ width: '38px', height: '38px', backgroundColor: '#F4F7FE' }}>
                    <i className="bi bi-people-fill" style={{ color: '#4318FF', fontSize: '1.2rem' }}></i>
                  </div>
                  <span className="fw-bold text-center" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Manage Users</span>
                </div>
              </div>

              {/* Get Product Button */}
              <div className="col-6">
                <div
                  className="d-flex flex-column align-items-center justify-content-center w-100"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E9EDF7',
                    borderRadius: '20px',
                    height: '100px',
                    transition: 'all 0.3s ease',
                    transform: isHovered === 'getProduct' ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered === 'getProduct' ? '0px 12px 25px rgba(112, 144, 176, 0.15)' : '0px 4px 10px rgba(112, 144, 176, 0.05)'
                  }}
                  onClick={() => navigate('/get-product')}
                  onMouseEnter={() => setIsHovered('getProduct')}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="rounded-circle mb-2 d-flex justify-content-center align-items-center" style={{ width: '38px', height: '38px', backgroundColor: '#F4F7FE' }}>
                    <i className="bi bi-box-seam" style={{ color: '#4318FF', fontSize: '1rem', fontWeight: 'bold' }}></i>
                  </div>
                  <span className="fw-bold text-center" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Manage Product</span>
                </div>
              </div>
              {/* Manage Category Button */}
              <div className="col-6">
                <div
                  className="d-flex flex-column align-items-center justify-content-center w-100"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E9EDF7',
                    borderRadius: '20px',
                    height: '100px',
                    transition: 'all 0.3s ease',
                    transform: isHovered === 'manageCategory' ? 'translateY(-4px)' : 'none',
                    boxShadow: isHovered === 'manageCategory' ? '0px 12px 25px rgba(112, 144, 176, 0.15)' : '0px 4px 10px rgba(112, 144, 176, 0.05)'
                  }}
                  onClick={() => navigate('/category')}
                  onMouseEnter={() => setIsHovered('manageCategory')}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className="rounded-circle mb-2 d-flex justify-content-center align-items-center" style={{ width: '38px', height: '38px', backgroundColor: '#F4F7FE' }}>
                    <i className="bi bi-tags-fill" style={{ color: '#4318FF', fontSize: '1rem', fontWeight: 'bold' }}></i>
                  </div>
                  <span className="fw-bold text-center" style={{ fontSize: '0.75rem', color: '#A3AED0' }}>Manage Category</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content Area placeholder */}
        <div className="col-12 col-md-7 col-lg-8 p-0 h-md-100 flex-grow-1">
          <div
            className="p-5 d-flex flex-column align-items-center justify-content-center h-100 overflow-auto"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.08)'
            }}
          >
            <div className="rounded-circle mb-4 d-flex justify-content-center align-items-center flex-shrink-0" style={{ width: '90px', height: '90px', backgroundColor: '#F4F7FE' }}>
              <i className="bi bi-graph-up-arrow" style={{ fontSize: '2.5rem', color: '#4318FF' }}></i>
            </div>
            <h3 className="fw-bold mb-2 text-center" style={{ color: '#2B3674' }}>Main Content Space</h3>
            <p className="text-secondary text-center" style={{ maxWidth: '400px', fontSize: '1.1rem', color: '#A3AED0' }}>Your beautiful data and main statistics will gracefully populate over here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;