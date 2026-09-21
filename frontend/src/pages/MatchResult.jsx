import { Link, useNavigate } from "react-router-dom";
import {useState, useEffect } from "react";
import "../App.css";

function MatchResult() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMatch = async()=>{
      const precomputed = localStorage.getItem("matchResultData");
      if(precomputed){
        setResult(JSON.parse(precomputed));
        setLoading(false);
        return;
      }
      const jobDescription =localStorage.getItem("jobDescription");
      const token = localStorage.getItem("token");
      if (!jobDescription){
        setError("No job description found. Please add one first.");
        setLoading(false);
        return;
      }
      if (!token) {
        setError("You must be logged in to view match results.");
        setLoading(false);
        navigate("/login");
        return;
      }
      try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/match`,{
          method: "POST",
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({jobDescription})
        });
        const data = await response.json();
        if (response.ok){
          setResult(data);
          localStorage.setItem("matchResultData",JSON.stringify(data));
        }else{
          setError(data.message || "Something went wrong while matching.");
        }
        }catch (err){
          setError("Something went wrong. Please try again.");
        }finally{
          setLoading(false);
        }
      };
      fetchMatch();
    },[navigate]);
  
  if (loading){
    return (
      <div className="result-page">
        <div className="result-box">
          <h1>Resume Match Result</h1>
          <p>Analyzing your resume against the job description...</p>
        </div>
      </div>
    );
  }
  if (error){
    return(
      <div className="result-page">
        <div className="result-box">
          <h1>Resume Match Result</h1>
          <p style={{color:"red"}}>{error}</p>
          <Link className="dashboard-link" to="/job-description">
          Add Job Description</Link>
        </div>
      </div>
    );
  }
  const {matchScore, matchedSkills, missingSkills} =result;
  const scoreLabel=
    matchScore >= 75 ? "Good Match!":
    matchScore >= 50 ? "Moderate Match":
    "Needs Improvement";
  return (
    <div className="result-page">
      <div className="result-box">
        <h1>Resume Match Result</h1>

        <div className="score">{matchScore}%          
        </div>

        <h2>{scoreLabel}</h2>

        <p>
          Your resume matches {matchScore}% of the skills mentioned
          in the job description.
        </p>

        <div className="result-section">
          <h3>Matching Skills</h3>
          <p>{matchedSkills.length > 0 ? matchedSkills.join(" ,"): "None found"}</p>
        </div>
        <div className="result-section">
          <h3>Missing Skills</h3>
          <p>{missingSkills.length > 0 ? missingSkills.join(", "): "None - great coverage!"}</p>
        </div>
        <div className="result-section">
          <h3>Suggestions</h3>
          <p>{missingSkills.length > 0
            ? `Consider improving or highlighting: ${missingSkills.slice(0, 5).join(",")}.`
             :"Your resume covers the key skills well."} </p>
        </div>

        <Link className="dashboard-link" to="/dashboard">Back to Dashboard
          </Link>
      </div>
    </div>
  );
}
export default MatchResult;
