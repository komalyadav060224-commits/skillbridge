import {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
function Register(){
  const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      if(password !== confirmPassword){
        setError("Passwords does not match");
        return;
      }
      try{
        const response = await fetch("http://localhost:5000/api/auth/register",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({name, email,password})    
        });
        if(response.ok){
          setSuccess("Account created! Redirecting to login..");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }else{
          setError(data.message);
        }
        }catch (err){
          setError("Something went wrong. Please try again");
      }
    };

  return(
        <div className="register-page">
      <div className="register-box">
        <h1>Create Account</h1>
        <p>Register to use SkillBridge</p>

        <form onSubmit ={handleSubmit}>
          <label>Full Name</label>
          <input type="text" placeholder="Enter Your Name"
           value={name}
           onChange={(e) =>setName(e.target.value)}
           required />

          <label>Password</label>
          <input type="password" placeholder="Create a password"
          value={password}
           onChange={(e) =>setPassword(e.target.value)}
           required />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password"
          value={confirmPassword}
           onChange={(e) =>setConfirmPassword(e.target.value)}
           required />

          <label>Email id</label>
          <input type="email" placeholder="Enter your email id"
          value={email}
           onChange={(e) =>setEmail(e.target.value)}
           required />

          <button type="submit">Register</button>           
        </form>
        {error && <p style={{color: "red", marginTop:"10px"}}>{error}</p>}
        {success && <p style={{color: "green", marginTop:"10px"}}>{success}</p>}

        <p className="login-text">
          Already Have An Account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
export default Register;