import {useState} from "react";
import {  useNavigate } from "react-router-dom";
import "../App.css";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(" ");
  const [success, setSuccess] = useState(" ");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const handleFileChange = (e) =>{
    setFile(e.target.files[0]);
    setError("");
    setSuccess(" ");
  };
  const handleSubmit = async (e) =>{
    e.preventDefault();
    setError("");
    setError("");
    setSuccess("");
  

      if (!file){
        setError("Please select a file first");
        return;
      }
      const token = localStorage.getItem("token");
      if(!token){
        setError("You must be logged in upload a resume");
        navigate("/login");
        return;
      }
      const formData = new FormData();
      formData.append("resume",file);
      try {
        setUploading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/upload`,{
          method:"POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
        const data = await response.json();
        if (response.ok){
          setSuccess("Resume uploaded successfully!");
        }else {
          setError(data.message || "Upload failed");
        }
      }catch (err){
        setError("Something went wrong. Please try again.");
      }finally{
        setUploading(false);
      }  
  };
   return (
    <div className="upload-page">
      <div className="upload-box">
        <h1>Upload Your Resume</h1>
        <p>PDF or DOCX, max 5MB</p>
        <form onSubmit={handleSubmit}>
          <div className="upload-dropzone">
            <input type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            id="resumeFile"/>   
            <label htmlFor="resumeFile">
              {file ? file.name: "Click to browser or drag a file here"}</label>       
          </div>
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading.." : "Upload resume"}
          </button>
          </form>
          {error && <p style={{ color:"red", marginTop:"12px"}}>{error}</p>}
          {success && (
            <>
              <p style={{color: "green",marginTop:"12px"}}>{success}</p>
              <button
                onClick={() => navigate("/job-description")}
                style={{ marginTop: "12px" }}
              >
                Continue to Job Description
              </button>
            </>
          )}
        </div>
      </div>
  );
}
export default UploadResume;