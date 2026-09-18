import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
function Dashboard() {
  const [resumeInfo, setResumeInfo]= useState(null);
  const [lastMatch, setLastMatch] = useState(null);
  useEffect(() =>{
    const fetchResume = async () =>{
      const token = localStorage.getItem("token");
      if (!token) return;
      try{
        const response = await fetch("http://localhost:5000/api/resumes/me",{
          headers:{Authorization: `Bearer ${token}`}
        });
        const data = await response.json();
        if(response.ok){
          setResumeInfo(data.resume);
        }
      }catch(err){
        console.log("Dashboard resume fetch error:",err);
      }
    };
    fetchResume();
    const savedMatch = localStorage.getItem("matchResultData");
    if(savedMatch){
      setLastMatch(JSON.parse(savedMatch));
    }
  },[]);
  return (
    <div className="dashboard-page">
      <div className="dashboard-box">
        <h1>Welcome to SkillBridge</h1>
        <p>
          Compare your resume with a job description and find out
          how well your skills match the job.
        </p>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>Upload Resume</h2>
            <p>
              {resumeInfo
               ? `Current resume: ${resumeInfo.fileName}`
               :"Upload your resume to analyze your skills."}
            </p>
            <Link to="/upload-resume">
              Upload Resume
            </Link>
          </div>
          <div className="dashboard-card">
            <h2>Job Description</h2>
            <p>Enter the job description you want to apply for.</p>
            <Link to="/job-description">
              Add Job Description
            </Link>
          </div>
          <div className="dashboard-card">
            <h2>Match Result</h2>
            <p>
              {lastMatch
               ? `Last match score: ${lastMatch.matchScore}%`
               : "Check your resume and job compatibility score."}
            </p>
            <Link to="/match-result">
              View Result
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
export default Dashboard;

