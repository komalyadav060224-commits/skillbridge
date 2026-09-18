const Resume = require("../models/Resume");
const fs = require("fs");
const path = require("path");
const  {PDFParse} = require("pdf-parse");
const mammoth = require("mammoth");
exports.uploadResume= async(req, res)=>{
    try{
        if( !req.file){
            return res.status(400).json({ message: "No file Uploaded"});
        }
        const newResume = new Resume({
            userId: req.userId,
            fileName: req.file.originalname,
            filePath: req.file.path
        });
        await newResume.save();
        res.status(201).json({
            message:"Resume uploaded successfully",
            resume: newResume
        });
    }catch (error){
        console.log("UPLOAD ERROR:", error);
        res.status(500).json({message:"Server Error", error:error.message});
    }
};
async function extractTextFromFile(filePath){
    const ext = path.extname(filePath).toLowerCase();
    if(ext == ".pdf"){
        const {PDFParse }= require("pdf-parse");
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({data: dataBuffer});
        const result = await parser.getText()
        await parser.destroy();
        return result.text;
    }else if (ext ===".docx"){
        const result = await mammoth.extractRawText({path:filePath});
        return result.value;
    }else{
        throw new Error("Unsupported file type for text extraction");
    }
}
const STOP_WORDS =new Set([
    "the" ,"and","a" , "an","to","of","in","for","on","with","is","are","as","at","by","this","that",
    "be","or","from","will","we","you","your","our","have","has","it",
    "its","their","they","them","can","who","what","when","where","which","also",
    "including","etc","using","use","used","across","within","into","about"
]);
function extractKeywords(text){
    const words = text
     .toLowerCase()
     .replace(/[^a-z0-9+.#\s]/g," ")
     .split(/\s+/)
     .filter(word => word.length > 2 && !STOP_WORDS.has(word));
    return [...new Set(words)];
}
function compareResumeToJob(resumeText, jobText){
    const resumeWords = new Set(extractKeywords(resumeText));
    const jobWords = extractKeywords(jobText);
    const matched = jobWords.filter(word => resumeWords.has(word));
    const missing = jobWords.filter(word => !resumeWords.has(word));
    const matchScore = jobWords.length === 0 
     ? 0
     : Math.round((matched.length / jobWords.length) * 100);
    return {
        matchScore,
        matchedSkills: matched.slice(0 , 25),
        missingSkills: missing.slice(0, 25),
    };
}
exports.matchResume = async (req, res)=>{
    try{
        const {jobDescription} = req.body;
        if (!jobDescription || !jobDescription.trim()) {
            return res.status(404).json({message: "Job Description is required."});
        }
        const resume = await Resume.findOne({userId: req.userId}).sort({createdAt: -1});
        if (!resume){
            return res.status(404).json({message:"No resume found. Please one first."});
        }
        const resumeText = await extractTextFromFile(resume.filePath);
        const result = compareResumeToJob(resumeText, jobDescription);
        res.status(200).json(result);
    }catch (error){
        console.log("MATCH ERROR:", error);
        res.status(500).json({message: "Server Error",error: error.message});
    }
};
exports.getMyResume = async(req, res) =>{
    try{
        const resume = await Resume.findOne({userId: req.userId}).sort({created: -1});
        if (!resume){
            return res.status(404).json({message:"No resume uploaded yet."});
        }
        res.status(200).json({resume});
    }catch(error){
        console.log("GET RESUME ERROR:", error);
        res.status(500).json({message: "Server Error", error:error.message});
    }
};
exports.matchResumeWithFile = async (req, res) =>{
    try{
        if(!req.file){
            return res.status(400).json({message:"No job description file uploaded"});
        }
        const resume = await Resume.findOne({userId: req.userId}).sort({ createdAt: -1});
        if (!resume){
            return res.status(404).json({message:"No resume found. Please upload one first."});            
        }
        const resumeText = await extractTextFromFile(resume.filePath);
        const jobText = await extractTextFromFile(req.file.path);
        const result = compareResumeToJob(resumeText, jobText);
        res.status(200).json(result);
    }catch(error){
        console.log("MATCH FILE ERROR:",error);
        res.status(500).json({message:"Server Error", error:error.message});
    }
};