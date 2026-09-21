import {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function JobDescription() {
  const [mode, setMode] = useState("paste");
  const [jobDescription, setJobDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleSaveText = () =>{
    if (!jobDescription.trim()){
      setError("Please paste a job description first.");;
      return;
    }
    localStorage.setItem("jobDescription", jobDescription);
    localStorage.removeItem("matchResultData");
    navigate("/match-result");
  };
  const handleSaveFile = async () =>{
    if(!file){
      setError("Please choose a PDF or DOCX file first.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token){
      setError("You must be logged in.");
      navigate("/login");
      return;
    }
    const formData = new FormData();
    formData.append("jobFile",file);
    try{
      setSubmitting(true);
      setError("");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/upload`,{
        method:"POST",
        headers: {Authorization:`Bearer ${token}`},
        body: formData          
      });
      const data = await response.json();
      if (response.ok){
        localStorage.setItem("matchResultData",JSON.stringify(data));
        localStorage.removeItem("jobDescription");
        navigate("/match-result");
      }else{
        setError(data.message || "Failed to process job description file.");
      }
    }catch (err){
      setError("Something went wring. Please try again.");
    }finally{
      setSubmitting(false);
    }
  }
  return (
    <div className="job-page">
      <div className="job-box">
        <h1>Job Description</h1>
        <p>Paste the job description, or upload it as a PDF/Docx file.</p>
          <div className="mode-toggle"> 
            <button
            className={mode === "paste" ? "active" : ""}
            onClick ={() => {setMode("paste"); setError("");}}
            >Paste Text</button>
            <button
            className={mode ==="upload" ? "active" : ""} 
            onClick={() => {setMode("upload"); setError("");}}
            >Upload File</button>
          </div>
          {mode ==="paste" &&(
            <>   
        <textarea
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => {setJobDescription(e.target.value);
            setError("");
          }}          
        ></textarea>
        {error && <p style={{ color:"red", marginTop:"8px"}}>{error}</p>}
        <button onClick={handleSaveText}>Save Job Description</button>
        </>
          )}
          {mode ==="upload" && (
            <>
            <div className="upload-dropzone">
            <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) =>{
              setFile(e.target.files[0]);
              setError("");
            }}/>
            <label htmlFor="jobFile">
              {file ? file.name:"Click to browse or drag a file here"}
            </label>
            </div>
          {error && <p style={{ color:"red", marginTop:"8px"}}>{error}</p>}
          <button onClick={handleSaveFile} disabled={submitting}>
            {submitting ? "Processing..." : "Upload & Check Match"}
          </button>
          </>
          )}

        <div className="page-links">
          <Link to="/upload-resume">Back</Link>
          <Link to="/match-result">Check Match</Link>
        </div>
      </div>
    </div>
  );
}

export default JobDescription;

