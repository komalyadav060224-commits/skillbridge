const mongoose = require("mongoose");
const resumeSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        fileName:{
            type:String,
            required:true
        },
        filePath:{
            type:String,
            required:true
        },
        rawText:{
            type:String,
        },
        parsedData:{
            skills:[String],
            experience:[
                {
                    title:String,
                    company:String,
                    duration:String,
                    description:String
                }
            ],
            education:[
                {
                    degree:String,
                    institution:String,
                    year:String
                }
            ],
            totalYearsExperience:Number
        }
    },
        {timestamps:true}    
);
module.exports = mongoose.model.Resume || mongoose.model("Resume",resumeSchema);