import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestOtp, verifyLogin } from '../api/auth';

const Login = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [timer, setTimer] = useState(60);

  const navigate = useNavigate();

  // Timer for Resend OTP
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      await requestOtp(username, password);
      // On success (status 200)
      setSuccessMsg('OTP sent to your registered email.');
      setStep(2);
      setTimer(60);
    } catch (error) {
      setErrorMsg(error.message || 'An error occurred while requesting OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await verifyLogin(username, password, otp);
      if (response && response.token) {
        localStorage.setItem('ship_admin_token', response.token);
        navigate('/dashboard');
      } else {
        setErrorMsg('Invalid response from server.');
      }
    } catch (error) {
      setErrorMsg(error.message || 'An error occurred while verifying OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await requestOtp(username, password);
      setSuccessMsg('OTP sent to your registered email.');
      setTimer(60);
    } catch (error) {
      setErrorMsg(error.message || 'An error occurred while resending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F4F7FE', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      <div 
        className="card border-0 d-flex flex-column" 
        style={{ 
          width: '90%', 
          maxWidth: '420px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '24px', 
          padding: '3rem 2.5rem',
          boxShadow: '0px 10px 30px rgba(112, 144, 176, 0.08)' 
        }}
      >
        <h2 className="text-center mb-1 fw-bold" style={{ color: '#2B3674' }}>Welcome Back</h2>
        <p className="text-center mb-4" style={{ color: '#A3AED0', fontSize: '0.95rem' }}>Login to your dashboard</p>
        
        {successMsg && <div className="alert alert-success text-center py-2" style={{ borderRadius: '12px' }}>{successMsg}</div>}
        {errorMsg && <div className="alert alert-danger text-center py-2" style={{ borderRadius: '12px' }}>{errorMsg}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div className="mb-4">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#2B3674' }}>Email Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ 
                  backgroundColor: '#F4F7FE', 
                  border: 'none', 
                  borderRadius: '16px', 
                  padding: '1rem',
                  fontSize: '0.95rem',
                  color: '#2B3674'
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#2B3674' }}>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  backgroundColor: '#F4F7FE', 
                  border: 'none', 
                  borderRadius: '16px', 
                  padding: '1rem',
                  fontSize: '0.95rem',
                  color: '#2B3674'
                }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn w-100 py-3 fw-bold"
              style={{ 
                borderRadius: '16px', 
                backgroundColor: '#5D44FE', 
                color: '#FFFFFF',
                boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Authenticating...</span>
              ) : 'Login'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyLogin}>
            <div className="mb-5">
              <label className="form-label fw-bold" style={{ fontSize: '0.85rem', color: '#2B3674' }}>Enter OTP</label>
              <input
                type="text"
                className="form-control"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                style={{ 
                  backgroundColor: '#F4F7FE', 
                  border: '1px solid #E9EDF7', 
                  borderRadius: '16px', 
                  padding: '1rem',
                  fontSize: '1.2rem',
                  letterSpacing: '8px', 
                  textAlign: 'center',
                  color: '#4318FF',
                  fontWeight: 'bold'
                }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn w-100 py-3 fw-bold mb-3"
              style={{ 
                borderRadius: '16px', 
                backgroundColor: '#5D44FE', 
                color: '#FFFFFF',
                boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Verifying...</span>
              ) : 'Verify & Proceed'}
            </button>

            <div className="text-center">
              <button 
                type="button" 
                className="btn btn-link text-decoration-none fw-bold"
                onClick={handleResendOtp}
                disabled={timer > 0 || isLoading}
                style={{ fontSize: '0.85rem', color: timer > 0 ? '#A3AED0' : '#5D44FE' }}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;