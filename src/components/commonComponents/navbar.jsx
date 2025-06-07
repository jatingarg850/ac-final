import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../../src/index.css';
import Button from './button';
import { Logo } from "../../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing user data:', err);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
    setError('');
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
        console.log('Fetching users to verify login...');

        // First get all users
        const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/users', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        console.log('Found users:', users.length);

        // Find matching user
        const user = users.find(u => 
            u.email === loginData.email && 
            u.password === loginData.password
        );

        if (user) {
            console.log('User found, logging in');
            // Store user data
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            setIsPopupOpen(false);
            
            // Check if user is admin and redirect
            console.log('Is admin?', user.is_admin);
            if (user.is_admin === true) {
                console.log('Redirecting to admin page...');
                navigate('/admin');
                return;
            }
            // If not admin, redirect to home
            navigate('/');
        } else {
            console.log('User not found or invalid credentials');
            setError('Invalid email or password. If you don\'t have an account, please sign up.');
            // Clear password field for security
            setLoginData(prev => ({
                ...prev,
                password: ''
            }));
        }
    } catch (err) {
        console.error('Login error details:', {
            message: err.message,
            stack: err.stack
        });
        
        if (err.message.includes('HTTP error!')) {
            const errorMessage = err.message.includes('body:') ? 
                err.message.split('body:')[1].trim().replace(/<[^>]*>/g, '') : 
                'Server error occurred';
            setError(errorMessage);
        } else {
            setError('Failed to connect to server. Please check your internet connection and try again.');
        }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
        // First check if user already exists
        const response = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/users', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        
        // Check if email already exists
        const userExists = users.some(u => u.email === signupData.email);
        
        if (userExists) {
            setError('User with this email already exists. Please login instead.');
            return;
        }

        // If user doesn't exist, proceed with signup
        const signupResponse = await fetch('https://actext-c24df4a0ce27.herokuapp.com/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: signupData.name,
                email: signupData.email,
                password: signupData.password,
                is_admin: false // Default to non-admin user
            }),
        });

        if (!signupResponse.ok) {
            const text = await signupResponse.text();
            throw new Error(`Signup failed: ${text}`);
        }

        const data = await signupResponse.json();
        console.log('Signup successful:', data);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsPopupOpen(false);
        navigate('/'); // Redirect to home after successful signup
        
    } catch (err) {
        console.error('Signup error details:', {
            message: err.message,
            stack: err.stack
        });
        
        if (err.message.includes('Signup failed:')) {
            setError(err.message.replace('Signup failed:', '').trim());
        } else {
            setError('Failed to create account. Please try again later.');
        }
    }
  };

  const handleContinue = () => {
    setIsPopupOpen(false); // Close the mobile number popup
    setIsOtpPopupOpen(true); // Open the OTP popup
  };

  const closeOtpPopup = () => {
    setIsOtpPopupOpen(false); // Close OTP popup
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo on left */}
          <div className="logo-container" style={{ cursor: 'pointer' }}>
            <NavLink to="/">
              <img src={Logo} alt="AC Wallah Logo" className="logo" />
            </NavLink>
          </div>

          {/* Right side navigation and auth */}
          <div className="nav-right">
            {/* Desktop Navigation */}
            <div className="nav-links">
              <NavLink to="/" className="nav-link" activeClassName="active">Home</NavLink>
              <NavLink to="/old_ac" className="nav-link" activeClassName="active">AC Listing</NavLink>
              <NavLink to="/pricing" className="nav-link" activeClassName="active">Pricing</NavLink>
              <NavLink to="/about" className="nav-link" activeClassName="active">About Us</NavLink>
            </div>
            <button className="refer-button">Refer Someone</button>

            {/* Show either profile icon or login button */}
            <div className="auth-button">
              {user ? (
                <div className="profile-menu">
                  <NavLink to="/profile" className="profile-icon">
                    <div className="avatar">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  </NavLink>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              ) : (
                <Button text="Login / Signup" className="default-button" onClick={togglePopup} />
              )}
            </div>
          </div>

          {/* Mobile Menu Button - only visible on small screens */}
          <div className="mobile-menu-button">
            <button onClick={toggleMenu}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <NavLink to="/" className="mobile-nav-link" activeClassName="active">Home</NavLink>
            <NavLink to="/old_ac" className="mobile-nav-link" activeClassName="active">AC Listing</NavLink>
            <NavLink to="/pricing" className="mobile-nav-link" activeClassName="active">Pricing</NavLink>
            <NavLink to="/about" className="mobile-nav-link" activeClassName="active">About Us</NavLink>
            <button className="refer-button">Refer Someone</button>
            {user ? (
              <>
                <NavLink to="/profile" className="mobile-nav-link">Profile</NavLink>
                <button className="mobile-login-button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button className="mobile-login-button" onClick={togglePopup}>Login / Signup</button>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Number Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="auth-page">
            <Button text="×" className="popup-close-button" onClick={togglePopup} />
            <div className="container" id="container">
              <div className="form-container sign-up-container">
                <form onSubmit={handleSignup}>
                  <h1 className="auth-heading">Create Account</h1>
                  <br />
                  <input 
                    type="text" 
                    name="name"
                    className="auth-input" 
                    placeholder="Name" 
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                  />
                  <input 
                    type="email" 
                    name="email"
                    className="auth-input" 
                    placeholder="Email" 
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                  />
                  <input 
                    type="password" 
                    name="password"
                    className="auth-input" 
                    placeholder="Password" 
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                  />
                  {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                  <br />
                  <Button text="Sign Up" className="default-button auth-btn" type="submit" />
                </form>
              </div>
              <div className="form-container sign-in-container">
                <form onSubmit={handleLogin}>
                  <h1 className="auth-heading">Sign in</h1>
                  <span className="auth-span">use your email account</span>
                  <input 
                    type="email" 
                    name="email"
                    className="auth-input" 
                    placeholder="Email" 
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                  <input 
                    type="password" 
                    name="password"
                    className="auth-input" 
                    placeholder="Password" 
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                  {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                  <br />
                  <Button text="Sign In" className="default-button auth-btn" type="submit" />
                </form>
              </div>
              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-left">
                    <h1 className="auth-heading">Welcome Back!</h1>
                    <p className="auth-paragraph">To keep connected with us please login with your personal info</p>
                    <Button
                      text="Sign In"
                      className="default-button-overlay"
                      id="signIn"
                      onClick={() => document.getElementById('container').classList.remove('right-panel-active')}
                    />
                  </div>
                  <div className="overlay-panel overlay-right">
                    <h1 className="auth-heading">Welcome to AC Wallah !!</h1>
                    <p className="auth-paragraph">Enter your details and become part of something great.</p>
                    <Button
                      text="Sign Up"
                      className="default-button-overlay"
                      id="signUp"
                      onClick={() => document.getElementById('container').classList.add('right-panel-active')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Popup */}
      {isOtpPopupOpen && (
        <div className="popup-overlay-otp">
          <div className="popup-container">
            <button className="popup-close-button" onClick={closeOtpPopup}>×</button>
            <h2>Enter OTP</h2>
            <p>Please enter the 4-digit OTP sent to your mobile number.</p>
            <div className="otp-input-container">
              <input type="text" maxLength="4" placeholder="Enter OTP" className="otp-input" />
            </div>
            <Button text="Verify" className="default-button" />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;