const jwt = require("jsonwebtoken");
const router = require("../routes/resumeRoutes");
const protect = (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({message: "No token Provided"});
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:",decoded);
        req.userId = decoded.id;
        next();
    }catch(error){
        res.status(401).json({message: "Invalid or expired token"});
    }
};
module.exports = protect;