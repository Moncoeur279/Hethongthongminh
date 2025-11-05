import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import "../styles/AccountMenu.css";

export function AccountMenu() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");


  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verifyForm, setVerifyForm] = useState({ email: "", code: "" });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (token) {
      setIsLoggedIn(true);
      if (storedName) setUserName(storedName);
      if (storedEmail) setUserEmail(storedEmail);
    }
  }, []);

  // lOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3030/auth/login`, loginForm);
      const { user, accessToken } = res.data;
      if (!accessToken) {
        alert("Login failed: no token returned");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);

      setIsLoggedIn(true);
      setUserName(user.name || user.email.split("@")[0]);
      setUserEmail(user.email);
      setLoginForm({ email: "", password: "" });
      setShowLoginModal(false);
      window.dispatchEvent(new Event("user-login"));
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3030/auth/register`, registerForm);
      alert(res.data.message);

      setVerifyForm({ email: registerForm.email, code: "" });
      setShowRegisterModal(false);
      setShowVerifyModal(true);
      setRegisterForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  // VERIFY EMAIL
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3030/auth/verify-email`, verifyForm);
      const { user, accessToken } = res.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);

      setIsLoggedIn(true);
      setUserName(user.name || user.email.split("@")[0]);
      setUserEmail(user.email);
      setShowVerifyModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Verify failed");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserName("User");
    setShowUserMenu(false);
    window.dispatchEvent(new Event("user-logout"));
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="auth-buttons">
          <button
            className="auth-button login-btn"
            onClick={() => setShowLoginModal(true)}
          >
            < FaUser /> Login
          </button>
          <button
            className="auth-button register-btn"
            onClick={() => setShowRegisterModal(true)}
          >
            < FaPlus /> Register
          </button>
        </div>

        {showLoginModal && (
          <div
            className="modal-overlay"
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Login to your account</h3>
                <button
                  className="close-button"
                  onClick={() => setShowLoginModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Login
                </button>
              </form>
            </div>
          </div>
        )}

        {showRegisterModal && (
          <div
            className="modal-overlay"
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create an account</h3>
                <button
                  className="close-button"
                  onClick={() => setShowRegisterModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Register
                </button>
              </form>
            </div>
          </div>
        )}

        {showVerifyModal && (
          <div
            className="modal-overlay"
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Verify your email</h3>
                <button
                  className="close-button"
                  onClick={() => setShowVerifyModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleVerify} className="auth-form">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={verifyForm.email} readOnly />
                </div>
                <div className="form-group">
                  <label>Verification Code</label>
                  <input
                    type="text"
                    value={verifyForm.code}
                    onChange={(e) =>
                      setVerifyForm({ ...verifyForm, code: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Verify
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  // Nếu đã đăng nhập
  return (
    <div className="user-menu-container">
      <button
        className="user-avatar"
        onClick={() => setShowUserMenu(!showUserMenu)}
      >
        {userName.charAt(0).toUpperCase()}
      </button>
      {showUserMenu && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-email">{userEmail}</div>
          </div>
          <div className="dropdown-divider"></div>
          <button
            className="dropdown-item"
            onClick={() => {
              setShowUserMenu(false);
              navigate("/profile");
            }}
          >
            < FaUser /> Profile
          </button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item logout-item" onClick={handleLogout}>
            < BiLogOut size={20} color="#ff0000" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
