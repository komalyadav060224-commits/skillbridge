import {useNavigate} from "react-router-dom";
import "../App.css";
function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="left">
          <div className="tag">
            ✦ SMART RESUME ANALYSIS
          </div>
          <h1>
            Match Your Resume<br />
            With Your <span>Dream Job</span></h1>
          <p>
            SkillBridge compares your resume with a job description
            and tells you how well they match. Find your match score,
            missing skills, and useful suggestions in one place.
          </p>
          <button className="button" onClick={() => navigate("/register")}>
            Analyze My Resume →</button>
          <div className="features">
            <div className="feature">
              <div className="icon">🎯</div>
              <h3>Match Score</h3>
              <p>Know your fit</p>
            </div>
            <div className="feature">
              <div className="icon">✓</div>
              <h3>Missing Skills</h3>
              <p>Know what to improve</p>
            </div>
            <div className="feature">
              <div className="icon">💡</div>
              <h3>Suggestions</h3>
              <p>Build a better resume</p>
            </div>
            <div className="feature">
              <div className="icon">🚀</div>
              <h3>Get Hired</h3>
              <p>Achieve your goals</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h2>Resume Match<br />Score</h2>
          <div className="score">82%</div>
          <div className="good">Good Match</div>
          <div className="progress">
            <div className="progress-bar"></div>
          </div>
          <div className="skills">
            <h3>
              <span className="green">✓</span>
              Skills Matched
            </h3>
            <p><span>✓</span> React</p>
            <p><span>✓</span> JavaScript</p>
            <p><span>✓</span> MongoDB</p>
            <h3 className="missing">
              <span className="red">×</span>
              Missing Skills
            </h3>
            <p className="aws">
              <span>×</span> AWS
            </p>
          </div>
        </div>
      </section>
      <section className="info">
        <div className="info-box">
          <div className="info-icon">📄</div>
          <h2>Analyze Your Resume</h2>
          <p>
            Upload your resume and compare it with your desired
            job description.
          </p>
        </div>
        <div className="info-box">
          <div className="info-icon">📊</div>
          <h2>Get Your Match Score</h2>
          <p>
            Understand how closely your skills match the job
            requirements.
          </p>
        </div>
        <div className="info-box">
          <div className="info-icon">🚀</div>
          <h2>Improve & Get Hired</h2>
          <p>
            Find missing skills and improve your chances of getting
            your dream job.
          </p>
        </div>
      </section>
    </div>
  );
}
export default Home;