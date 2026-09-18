import { NavLink } from "react-router-dom";
import "../App.css";
function Navbar(){
    return (
    <div className="header">
        <div className="logo">
            Skill<span>Bridge</span>
        </div>
        <div className="nav">
            <NavLink to="/" end className={({isActive}) =>(isActive ? "box active" : "box")}>Home</NavLink>
            <NavLink to="/login" end className={({isActive}) =>(isActive ? "box active" : "box")}>Login</NavLink>
            <NavLink to="/Register" end className={({isActive}) =>(isActive ? "box active" : "box")}>Register</NavLink>
            <NavLink to="/dashboard" end className={({isActive}) =>(isActive ? "box active" : "box")}>Dashboard</NavLink>
            <NavLink to="/upload-resume" end className={({isActive}) =>(isActive ? "box active" : "box")}>UploadResume</NavLink>
            <NavLink to="/job-description" end className={({isActive}) =>(isActive ? "box active" : "box")}>JobDescription</NavLink>
            <NavLink to="/match-result" end className={({isActive}) =>(isActive ? "box active" : "box")}>MatchResult</NavLink>            
        </div>
    </div>
    );
}
export default Navbar;
