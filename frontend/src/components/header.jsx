import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function header() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) => (isActive ? "box active" : "box");

  return (
    <header className="header">
      <div className="logo">
        Skill<span>Bridge</span>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>

        {!isLoggedIn && (
          <>
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Register
            </NavLink>
          </>
        )}

        {isLoggedIn && (
          <>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/upload-resume" className={linkClass}>
              Upload Resume
            </NavLink>
            <NavLink to="/job-description" className={linkClass}>
              Job Description
            </NavLink>
            <NavLink to="/match-result" className={linkClass}>
              Match Result
            </NavLink>
            <NavLink onClick={handleLogout} className="box">
              Logout
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default header;