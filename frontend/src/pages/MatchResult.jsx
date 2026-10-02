import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";

function MatchResult() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [additionalSkills, setAdditionalSkills] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatch = async () => {
      // 1. Result already computed (for example after a job description file upload)
      const precomputed = localStorage.getItem("matchResultData");
      if (precomputed) {
        try {
          const data = JSON.parse(precomputed);
          setResult(data);
          // Keep the job description available for the Generate button
          if (data.jobDescription) {
            localStorage.setItem("jobDescription", data.jobDescription);
          }
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem("matchResultData"); // corrupted, fetch again
        }
      }

      // 2. Otherwise compute the match from the saved job description
      const jobDescription = localStorage.getItem("jobDescription");
      const token = localStorage.getItem("token");

      if (!jobDescription) {
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

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/resumes/match`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ jobDescription }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setResult(data);
          localStorage.setItem("matchResultData", JSON.stringify(data));
        } else {
          setError(data.message || "Something went wrong while matching.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [navigate]);

  const handleGenerateResume = async () => {
    // Use the saved job description, or the one returned with the match result
    const jobDescription =
      localStorage.getItem("jobDescription") || result?.jobDescription || "";

    if (!jobDescription.trim()) {
      setGenerateError("Job description not found. Please go back and add one again.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setGenerateError("You must be logged in.");
      navigate("/login");
      return;
    }

    try {
      setGenerating(true);
      setGenerateError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resumes/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobDescription, additionalSkills }),
        }
      );

      if (!response.ok) {
        let message = "Failed to generate resume.";
        try {
          const data = await response.json();
          message = data.error || data.message || message;
        } catch {
          /* response was not JSON, keep the default message */
        }
        setGenerateError(message);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored_resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setGenerateError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="result-page">
        <div className="result-box">
          <h1>Resume Match Result</h1>
          <p>Analyzing your resume against the job description...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-page">
        <div className="result-box">
          <h1>Resume Match Result</h1>
          <p style={{ color: "red" }}>{error}</p>
          <Link className="dashboard-link" to="/job-description">
            Add Job Description
          </Link>
        </div>
      </div>
    );
  }

  const { matchScore = 0, matchedSkills = [], missingSkills = [] } = result;
  const scoreLabel =
    matchScore >= 75
      ? "Good Match!"
      : matchScore >= 50
      ? "Moderate Match"
      : "Needs Improvement";

  return (
    <div className="result-page">
      <div className="result-box">
        <h1>Resume Match Result</h1>

        <div className="score">{matchScore}%</div>

        <h2>{scoreLabel}</h2>

        <p>
          Your resume matches {matchScore}% of the skills mentioned in the job
          description.
        </p>

        <div className="result-section">
          <h3>Matching Skills</h3>
          <p>{matchedSkills.length > 0 ? matchedSkills.join(", ") : "None found"}</p>
        </div>

        <div className="result-section">
          <h3>Missing Skills</h3>
          <p>
            {missingSkills.length > 0
              ? missingSkills.join(", ")
              : "None - great coverage!"}
          </p>
        </div>

        <div className="result-section">
          <h3>Suggestions</h3>
          <p>
            {missingSkills.length > 0
              ? `Consider improving or highlighting: ${missingSkills
                  .slice(0, 5)
                  .join(", ")}.`
              : "Your resume covers the key skills well."}
          </p>
        </div>

        <div className="result-section">
          <h3>Generate Tailored Resume</h3>
          <textarea
            placeholder="Any additional skills? (comma separated)"
            value={additionalSkills}
            onChange={(e) => setAdditionalSkills(e.target.value)}
            style={{
              width: "100%",
              minHeight: "80px",
              marginBottom: "8px",
              padding: "10px",
            }}
          />
          {generateError && (
            <p style={{ color: "red", marginTop: "4px" }}>{generateError}</p>
          )}
          <button
            className="dashboard-link"
            onClick={handleGenerateResume}
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Tailored Resume (PDF)"}
          </button>
        </div>

        <Link className="dashboard-link" to="/dashboard">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default MatchResult;