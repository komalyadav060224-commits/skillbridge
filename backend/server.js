require("dotenv").config();
const express =require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/resumes", resumeRoutes);
app.use("/api/auth",authRoutes);
console.log("Auth routes mounted successfully");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});