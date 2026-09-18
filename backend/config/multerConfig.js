const multer = require("multer");
const path = require("path");
const fs = require("fs");
const resumeDir = "uploads/resumes";
const jobDescDir = "uploads/job-descriptions";
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true});
if (!fs.existsSync(jobDescDir)) fs.mkdirSync(jobDescDir, {recursive: true});

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if (file.fileName === "jobFile"){
            cb(null, jodDescDir);
        }else {
            cb(null, resumeDir);
        }
    },
    filename: function (req, file, cb){
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});
const fileFilter = (req, file, cb)=>{
    const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (allowedTypes.includes(file.mimetype)){
        cb(null, true);
    }else {
        cb(new Error("Only PDF and DOCX files are allowed"), false);
    }
};
const upload= multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5 * 1024 *1024}
});
module.exports = upload;