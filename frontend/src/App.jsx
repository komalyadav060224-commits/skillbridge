import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import JobDescription from "./pages/JobDescription";
import MatchResult from "./pages/MatchResult";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
     <Header />
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/job-description" element={<JobDescription />} />
        <Route path="/match-result" element={<MatchResult />} />
      


      </Routes>
      <Footer />
    </BrowserRouter>
    </AuthProvider>
  );
}
export default App;