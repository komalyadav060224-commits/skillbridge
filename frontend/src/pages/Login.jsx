import {AuthContext} from "../context/AuthContext";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
function Login(){
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[error, setError] = useState("");
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
        setError("");
        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email,password})
            });
            const data = await response.json();
            if(response.ok){
                localStorage.setItem("token",data.token);
                login(data.user);
                navigate("/dashboard");                
            }else{
                setError(data.message);
            }
        }catch (err){
            setError("Something went wrong. Please try again.");
        }
    };
    return(
        <div className="login-page">
            <div className="login-box">
                <h1>Welcome to SkillBridge</h1>
                <p>Login to Continue</p>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                    <label>Password</label>
                    <input type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p style={{color: "red", marginTop: "10px" }}>{error}</p>}
                <p className="signup-text">
                    Don't have an account?{" "}<Link to="/register">Register</Link>
                     

                </p>
            </div>
        </div>
    );
}
export default Login;