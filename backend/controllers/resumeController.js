const { GoogleGenerativeAI } = require("@google/generative-ai");
const PDFDocument = require("pdfkit");
const Resume = require("../models/Resume");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";


async function extractTextFromBuffer(buffer, filename) {
    const ext = path.extname(filename || "").toLowerCase();

    if (ext === ".pdf") {
        const parser = new PDFParse({ data: new Uint8Array(buffer) });
        try {
            const result = await parser.getText();
            return result.text;
        } finally {
            await parser.destroy();
        }
    }

    if (ext === ".docx") {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    throw new Error("Unsupported file type. Please upload a PDF or DOCX file.");
}

// ---------------------------------------------------------------
// Skills list
// ---------------------------------------------------------------
const SKILLS_LIST = [
    // ---------- Software / IT ----------
    "javascript", "typescript", "python", "java", "c++", "c#", "php", "ruby", "golang", "rust", "kotlin", "swift",
    "html", "html5", "css", "css3", "sass", "tailwind", "bootstrap", "es6",
    "react", "react.js", "angular", "vue", "vue.js", "next.js", "nuxt", "svelte", "redux", "jquery",
    "node", "node.js", "express", "express.js", "django", "flask", "spring", "spring boot", "laravel", "fastapi",
    "mongodb", "mysql", "postgresql", "sqlite", "redis", "firebase", "oracle", "sql", "nosql",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ci/cd", "devops",
    "git", "github", "gitlab", "bitbucket",
    "rest api", "graphql", "api", "microservices", "websocket",
    "jwt", "oauth", "authentication", "authorization", "cybersecurity", "network security", "ethical hacking",
    "testing", "manual testing", "automation testing", "jest", "mocha", "selenium",
    "webpack", "vite", "npm", "yarn", "linux", "windows", "bash", "shell scripting",
    "react native", "flutter", "android", "ios", "mobile development", "responsive design",
    "networking", "cloud computing", "database management", "system administration", "technical support",
    "software development", "web development", "full stack", "frontend", "backend", "data structures", "algorithms",

    // ---------- Data / AI ----------
    "machine learning", "deep learning", "data science", "data analysis", "data analytics", "data visualization",
    "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "nlp", "computer vision",
    "ai", "artificial intelligence", "big data", "hadoop", "spark", "etl", "statistics", "r programming",
    "power bi", "tableau", "excel", "advanced excel", "google sheets", "looker", "business intelligence",

    // ---------- Design / Creative ----------
    "ui", "ux", "ui/ux", "figma", "adobe xd", "photoshop", "illustrator", "canva", "indesign", "after effects",
    "premiere pro", "video editing", "motion graphics", "graphic design", "logo design", "typography",
    "photography", "3d modeling", "blender", "animation", "branding",

    // ---------- Electronics / Electrical ----------
    "embedded systems", "arduino", "raspberry pi", "microcontrollers", "vlsi", "pcb design", "circuit design",
    "matlab", "simulink", "plc", "scada", "iot", "robotics", "power systems", "electrical wiring",
    "analog electronics", "digital electronics", "signal processing", "telecommunications", "autocad electrical",

    // ---------- Mechanical / Manufacturing ----------
    "autocad", "solidworks", "catia", "ansys", "creo", "fusion 360", "cad", "cam", "cnc", "3d printing",
    "thermodynamics", "fluid mechanics", "hvac", "welding", "machining", "quality control", "quality assurance",
    "lean manufacturing", "six sigma", "kaizen", "iso 9001", "maintenance", "production planning",
    "automobile engineering", "product design", "gd&t",

    // ---------- Civil / Architecture ----------
    "revit", "staad pro", "etabs", "primavera", "ms project", "construction management", "site supervision",
    "structural analysis", "surveying", "estimation", "quantity surveying", "building codes", "bim",
    "sketchup", "interior design", "architectural design", "project planning",

    // ---------- Chemical / Biotech / Pharma ----------
    "chemical engineering", "process engineering", "laboratory skills", "hplc", "gmp", "glp", "pcr",
    "bioinformatics", "microbiology", "clinical research", "pharmacovigilance", "regulatory affairs",
    "quality assurance pharma", "drug development", "analytical chemistry", "biotechnology",

    // ---------- Healthcare / Medical ----------
    "patient care", "nursing", "clinical skills", "first aid", "cpr", "emergency care", "diagnosis",
    "medical records", "phlebotomy", "pharmacy", "physiotherapy", "public health", "healthcare management",
    "medical coding", "hipaa", "infection control", "telemedicine", "counseling",

    // ---------- Finance / Accounting / Commerce ----------
    "accounting", "bookkeeping", "financial reporting", "financial analysis", "financial modeling", "budgeting",
    "forecasting", "auditing", "taxation", "gst", "tds", "income tax", "accounts payable", "accounts receivable",
    "tally", "tally erp", "quickbooks", "sap", "sap fico", "erp", "payroll", "reconciliation",
    "banking", "investment banking", "equity research", "risk management", "credit analysis", "insurance",
    "wealth management", "portfolio management", "ifrs", "compliance", "valuation",

    // ---------- HR / Management ----------
    "recruitment", "talent acquisition", "onboarding", "employee engagement", "performance management",
    "hr operations", "hris", "training and development", "payroll processing", "labor law",
    "people management", "team management", "stakeholder management", "strategic planning",
    "business development", "business analysis", "operations management", "change management", "mba",

    // ---------- Sales / Marketing ----------
    "sales", "b2b sales", "lead generation", "cold calling", "account management", "client relationship",
    "crm", "salesforce", "hubspot", "zoho", "marketing", "digital marketing", "seo", "sem", "google ads",
    "facebook ads", "social media", "social media marketing", "content marketing", "content writing",
    "copywriting", "email marketing", "market research", "brand management", "google analytics",
    "influencer marketing", "public relations", "event management", "e-commerce",

    // ---------- Operations / Supply chain ----------
    "supply chain", "logistics", "procurement", "inventory management", "warehouse management",
    "vendor management", "purchasing", "demand planning", "shipping", "import export", "customs",

    // ---------- Legal / Government ----------
    "legal research", "contract drafting", "contract management", "litigation", "corporate law",
    "intellectual property", "legal compliance", "paralegal", "policy analysis", "public administration",

    // ---------- Education / Training ----------
    "teaching", "lesson planning", "curriculum development", "classroom management", "tutoring",
    "e-learning", "instructional design", "academic writing", "student counseling", "mentoring",

    // ---------- Media / Journalism / Writing ----------
    "journalism", "editing", "proofreading", "technical writing", "blogging", "scriptwriting",
    "content creation", "video production", "podcasting", "translation", "storytelling",

    // ---------- Hospitality / Customer-facing ----------
    "customer service", "customer support", "front desk", "hotel management", "food safety",
    "event planning", "travel planning", "guest relations", "call center", "client servicing",

    // ---------- Tools / Office ----------
    "ms office", "microsoft office", "word", "powerpoint", "outlook", "google workspace",
    "jira", "trello", "asana", "slack", "notion",

    // ---------- Soft skills ----------
    "communication", "teamwork", "leadership", "problem solving", "time management", "critical thinking",
    "collaboration", "adaptability", "negotiation", "presentation", "research", "analytics",
    "decision making", "creativity", "attention to detail", "multitasking", "interpersonal skills",
    "conflict resolution", "project management", "agile", "scrum", "organization", "public speaking"
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Whole-word matching, so "go" no longer matches "good" and "ai" no longer matches "said"
function extractSkillsFromText(text) {
    const lowerText = (text || "").toLowerCase();
    return SKILLS_LIST.filter((skill) => {
        const re = new RegExp(`(^|[^a-z0-9+#])${escapeRegex(skill)}($|[^a-z0-9+#])`);
        return re.test(lowerText);
    });
}

function compareResumeToJob(resumeText, jobText) {
    const resumeSkills = new Set(extractSkillsFromText(resumeText));
    const jobSkills = [...new Set(extractSkillsFromText(jobText))];

    const matched = jobSkills.filter((skill) => resumeSkills.has(skill));
    const missing = jobSkills.filter((skill) => !resumeSkills.has(skill));

    const matchScore =
        jobSkills.length === 0
            ? 0
            : Math.round((matched.length / jobSkills.length) * 100);

    return { matchScore, matchedSkills: matched, missingSkills: missing };
}
function buildResumePdf(doc, data) {
    const ACCENT = "#1a5f7a";
    const DARK = "#222222";
    const MUTED = "#555555";
    const left = doc.page.margins.left;
    const width = doc.page.width - left - doc.page.margins.right;

    const ensureSpace = (needed = 90) => {
        if (doc.y > doc.page.height - doc.page.margins.bottom - needed) doc.addPage();
    };

    const heading = (title) => {
        ensureSpace(80);
        doc.moveDown(0.9);
        doc.font("Helvetica-Bold").fontSize(11.5).fillColor(ACCENT)
            .text(title.toUpperCase(), left, doc.y, { characterSpacing: 1 });
        const lineY = doc.y + 2;
        doc.moveTo(left, lineY).lineTo(left + width, lineY)
            .lineWidth(0.8).strokeColor(ACCENT).stroke();
        doc.y = lineY + 7;
        doc.fillColor(DARK);
    };

    // Bold text on the left, muted text (usually dates) aligned to the right
    const row = (leftText, rightText) => {
        ensureSpace(70);
        const y = doc.y;
        const rightWidth = rightText ? 130 : 0;
        doc.font("Helvetica-Bold").fontSize(11).fillColor(DARK)
            .text(leftText || "", left, y, { width: width - rightWidth - 10 });
        const leftEnd = doc.y;
        if (rightText) {
            doc.font("Helvetica").fontSize(10).fillColor(MUTED)
                .text(rightText, left + width - rightWidth, y, { width: rightWidth, align: "right" });
        }
        doc.y = Math.max(leftEnd, doc.y);
    };

    const subLine = (text) => {
        if (!text) return;
        doc.font("Helvetica-Oblique").fontSize(10).fillColor(MUTED).text(text, left, doc.y, { width });
    };

    const bullets = (items) => {
        const clean = (items || []).filter(Boolean);
        if (!clean.length) return;
        doc.moveDown(0.2);
        doc.font("Helvetica").fontSize(10).fillColor(DARK).list(clean, left + 4, doc.y, {
            width: width - 4,
            bulletRadius: 1.8,
            textIndent: 12,
            bulletIndent: 4,
            lineGap: 2,
        });
    };

    // ----- Header -----
    doc.font("Helvetica-Bold").fontSize(24).fillColor(DARK)
        .text(data.name || "Candidate Name", left, doc.page.margins.top, { align: "center", width });
    const contact = [data.email, data.phone].filter(Boolean).join("   |   ");
    if (contact) {
        doc.moveDown(0.2);
        doc.font("Helvetica").fontSize(10).fillColor(MUTED).text(contact, left, doc.y, { align: "center", width });
    }
    const headerLineY = doc.y + 8;
    doc.moveTo(left, headerLineY).lineTo(left + width, headerLineY)
        .lineWidth(1.5).strokeColor(ACCENT).stroke();
    doc.y = headerLineY + 4;

    // ----- Summary -----
    if (data.summary) {
        heading("Professional Summary");
        doc.font("Helvetica").fontSize(10.5).fillColor(DARK)
            .text(data.summary, left, doc.y, { width, lineGap: 2, align: "justify" });
    }

    // ----- Skills -----
    if (data.skills && data.skills.length) {
        heading("Skills");
        doc.font("Helvetica").fontSize(10.5).fillColor(DARK)
            .text(data.skills.join("  •  "), left, doc.y, { width, lineGap: 3 });
    }

    // ----- Experience -----
    const experience = (data.experience || []).filter((e) => e && (e.title || e.company));
    if (experience.length) {
        heading("Experience");
        experience.forEach((exp) => {
            row(exp.title, exp.duration);
            subLine(exp.company);
            bullets(exp.bullets);
            doc.moveDown(0.6);
        });
    }

    // ----- Projects -----
    const projects = (data.projects || []).filter((p) => p && p.name);
    if (projects.length) {
        heading("Projects");
        projects.forEach((proj) => {
            row(proj.name);
            if (proj.description) {
                doc.font("Helvetica").fontSize(10).fillColor(DARK)
                    .text(proj.description, left, doc.y, { width, lineGap: 2 });
            }
            doc.moveDown(0.6);
        });
    }

    // ----- Education -----
    const education = (data.education || []).filter((e) => e && (e.degree || e.institution));
    if (education.length) {
        heading("Education");
        education.forEach((edu) => {
            row(edu.degree, edu.year);
            subLine(edu.institution);
            doc.moveDown(0.5);
        });
    }
}

// ---------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const text = await extractTextFromBuffer(req.file.buffer, req.file.originalname);
        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Could not read any text from this file. Please upload a text-based PDF or DOCX.",
            });
        }

        const newResume = await Resume.create({
            userId: req.userId,
            fileName: req.file.originalname,
            rawText:text,
        });

        res.status(201).json({
            message: "Resume uploaded successfully",
            resume: {
                _id: newResume._id,
                fileName: newResume.fileName,
                createdAt: newResume.createdAt,
            },
        });
    } catch (error) {
        console.log("UPLOAD ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.matchResume = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: "Job Description is required." });
        }

        const resume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: "No resume found. Please upload one first." });
        }
        if (!resume.text) {
            return res.status(400).json({ message: "Please upload your resume again." });
        }

        const result = compareResumeToJob(resume.text, jobDescription);
        res.status(200).json({ ...result, jobDescription });
    } catch (error) {
        console.log("MATCH ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getMyResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.userId })
            .sort({ createdAt: -1 })
            .select("-rawText");
        if (!resume) {
            return res.status(404).json({ message: "No resume uploaded yet." });
        }
        res.status(200).json({ resume });
    } catch (error) {
        console.log("GET RESUME ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.matchResumeWithFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No job description file uploaded" });
        }

        const resume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: "No resume found. Please upload one first." });
        }
        if (!resume.rawText) {
            return res.status(400).json({ message: "Please upload your resume again." });
        }

        const jobText = await extractTextFromBuffer(req.file.buffer, req.file.originalname);
        if (!jobText || !jobText.trim()) {
            return res.status(400).json({ message: "Could not read any text from the job description file." });
        }

        const result = compareResumeToJob(resume.rawText, jobText);
        res.status(200).json({ ...result, jobDescription: jobText });
    } catch (error) {
        console.log("MATCH FILE ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.generateResume = async (req, res) => {
    try {
        const { jobDescription, additionalSkills } = req.body;
        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({ message: "Job Description is required." });
        }

        const resume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: "No resume found. Please upload one first." });
        }
        if (!resume.rawText) {
            return res.status(400).json({ message: "Please upload your resume again." });
        }
        const existingResumeText = resume.rawText;

        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            generationConfig: { responseMimeType: "application/json" },
        });

        const prompt = `You are a professional resume writer. Below is a candidate's existing resume, some additional skills they want included, and a job description they are applying for.

Your task:
1. Extract the candidate's real personal details (name, email, phone, education, past experience, projects) from their existing resume text.
2. Combine this with the additional skills they provided.
3. Rewrite and restructure everything into a strong, tailored resume specifically optimized for the job description — rephrase bullet points, prioritize relevant skills/experience, and use strong action verbs.
4. Do NOT invent fake companies, degrees, or experience that isn't present in the original resume. Only rephrase and prioritize what's real, and naturally incorporate the additional skills provided.
5. Keep it concise and ATS-friendly: a summary of at most 3 sentences, at most 4 bullet points per experience entry, each bullet under 25 words, and put the most relevant skills first.
Respond ONLY in this exact JSON format, no extra text, no markdown:
{
  "name": "",
  "email": "",
  "phone": "",
  "summary": "2-3 sentence professional summary tailored to this job",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    { "title": "", "company": "", "duration": "", "bullets": ["point1", "point2"] }
  ],
  "education": [
    { "degree": "", "institution": "", "year": "" }
  ],
  "projects": [
    { "name": "", "description": "" }
  ]
}
Existing Resume:
${existingResumeText}
Additional Skills Provided by Candidate:
${additionalSkills || "None"}
Job Description:
${jobDescription}`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json|```/g, "").trim();
        const resumeData = JSON.parse(responseText);

        // Safe filename (names can contain characters that break headers)
        const safeName = (resumeData.name || "resume").replace(/[^a-z0-9]+/gi, "_");

        const doc = new PDFDocument({
            size: "A4",
            margins: { top: 45, bottom: 45, left: 50, right: 50 },
        });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${safeName}_tailored_resume.pdf"`);
        doc.pipe(res);

        buildResumePdf(doc, resumeData);

        doc.end();
    } catch (error) {
        console.log("GENERATE RESUME ERROR:", error);
        if (!res.headersSent) {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    }
};