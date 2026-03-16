import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-bracket">&lt;</span>
          StackFlow
          <span className="logo-bracket">/&gt;</span>
        </Link>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link
                to="/ask"
                className={`btn btn-primary btn-sm ${location.pathname === '/ask' ? 'active' : ''}`}
              >
                + Ask Question
              </Link>
              <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
                <img src={user.avatar} alt={user.username} className="user-avatar" />
                <span className="user-name">{user.username}</span>
                <span className="user-rep">{user.reputation} rep</span>
                {menuOpen && (
                  <div className="dropdown">
                    <div className="dropdown-info">
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="dropdown-item danger">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
