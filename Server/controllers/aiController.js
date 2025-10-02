import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import { response } from "express";
import {v2 as cloudinary}from 'cloudinary';
import FormData from 'form-data';
import axios from 'axios';
import  fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';      // ✅ DOCX text extractor

//  import pdf from 'pdf-p
// arse/lib/pdf-parse.js';
// import pdfParse from "pdf-parse";
// import pdf from 'pdf-parse';


import path from "path";


const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth; // if using Clerk middleware
    const { text, length } = req.body; // text to summarize
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to premium to continue"
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: `Please summarize the following text:\n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: length
    });

    const summary = response.choices[0].message?.content || "";

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${text}, ${summary}, 'summary')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, summary });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);

    const { userId } = req.auth(); // updated for Clerk v-next
    const { transcript, length } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!transcript || !length) {
      console.log("Missing transcript or length");
      return res.status(400).json({
        success: false,
        message: "Transcript and length are required."
      });
    }

    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.status(403).json({
        success: false,
        message: "Limit reached. Upgrade to premium to continue"
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: `Please summarize the following meeting transcript into clear bullet points (approx. ${length} words):\n\n${transcript}`
        }
      ],
      temperature: 0.7,
      max_tokens: length
    });

    const summary = response.choices[0].message?.content || "";

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${transcript}, ${summary}, 'meeting-summary')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, summary });
  } catch (error) {
    console.error("AI Summarizer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




// export const generateImage = async (req, res) => {

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth(); // For Clerk middleware
    const { text, targetLanguage, mode } = req.body; // text to learn, target language, and mode (translate/quiz)
    const plan = req.plan;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (plan !== "premium") {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (!text || !targetLanguage || !mode) {
      return res.status(400).json({
        success: false,
        message: "Please provide text, targetLanguage, and mode",
      });
    }

    // Build the AI prompt based on mode
    let prompt = "";
    if (mode === "translate") {
      prompt = `Translate the following text into ${targetLanguage} in a natural, human-like style:\n\n${text}`;
    } else if (mode === "quiz") {
      prompt = `Create a short language learning exercise for the following text in ${targetLanguage}:\n\n${text}\n- Include multiple-choice questions or fill-in-the-blank.`;
    } else {
      prompt = `Provide language learning suggestions for the following text in ${targetLanguage}:\n\n${text}`;
    }

    // Generate AI response
    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message?.content || "";

    // Save to database
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${text}, ${content}, 'language-learning')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error("Language Learning Assistant Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//   try {
//     const { userId } = req.auth; // if using Clerk middleware
//     const { prompt, publish} = req.body;
//     const plan = req.plan;
    

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions"
//       });
//     }
     
//     const formData =new FormData()
//     form.append('prompt',prompt)
//     const {data}=  await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
//         headers: {'X-api-key':process.env.CLIPDROP_API_KEY},
//         responseType: "arrayBuffer",
//      })

//      const base64Image =`data:image/png;base64,${Buffer.from(data,'binary'). 
//         toString('base64')}`;

//       const {secure_url}=  await cloudinary.uploader.upload(base64Image)

//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type,publish)
//       VALUES (${userId}, ${prompt}, ${secure_url}, 'image',${publish ?? false})
//     `;

   
//     res.json({ success: true,content: secure_url });
//   } catch (error) {
//     console.error(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };




// export const removeImageBackground = async (req, res) => {
//   try {
//     const { userId } = req.auth; // Clerk middleware
//     const image =req.file;
//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions",
//       });
//     }

//     // Create form data correctly
//     const formData = new FormData();
//     formData.append('prompt', prompt);

    

//     // Upload to Cloudinary
//     const { secure_url } = await cloudinary.uploader.upload(image.path,{
//         transformation: [
//             {
//                 effect: 'background_removal',
//                 background_removal:'remove_the_background'
//             }
//         ]
//     });


//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type)
//       VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
//     `;

//     res.json({ success: true, content: secure_url });
//   } catch (error) {
//     console.error(error.message);
//     res.json({ success: true, message: error.message });
//   }
// };

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk middleware
    const plan = req.plan || "free";
    const { recipientType, tone, keyPoints } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!recipientType || !tone || !keyPoints) {
      return res.status(400).json({
        success: false,
        message: "Please provide recipientType, tone, and keyPoints",
      });
    }

    // ✅ Check plan limitations
    if (plan !== "premium" && keyPoints.length > 500) {
      return res.json({
        success: false,
        message: "Free users can only generate emails with up to 500 characters in keyPoints. Upgrade to premium for more.",
      });
    }

    // ✅ AI prompt for Email Composer
    const prompt = `
      Write a professional email.
      Recipient type: ${recipientType}
      Tone: ${tone}
      Key points to include: ${keyPoints}

      Format it like a proper email (with greeting, body, and closing).
      Keep it concise, clear, and human-like.
    `;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 400,
    });

    const content = response.choices[0].message?.content || "";

    // ✅ Save in DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'email')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error("Email Composer Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};






// export const removeImageObject = async (req, res) => {
//   try {
//     const { userId } = req.auth; // Clerk middleware
//     const { object } = req.body;
//     const image = req.file; // multer file
//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.status(403).json({
//         success: false,
//         message: "This feature is only available for premium subscriptions",
//       });
//     }

//     if (!object || object.split(" ").length > 1) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a single object name",
//       });
//     }

//     // Upload the original image
//     const uploaded = await cloudinary.uploader.upload(image.path, {
//       resource_type: "image",
//     });

//     // Remove object using gen_remove
//     const imageUrl = cloudinary.url(uploaded.public_id, {
//       resource_type: "image",
//       transformation: [
//         {
//           effect: "gen_remove",
//           prompt: object,
//         },
//       ],
//     });

//     // Optionally: save to database
//     // await sql`INSERT INTO creations (user_id, prompt, content, type)
//     // VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

//     // Delete local file
//     fs.unlinkSync(image.path);

//     res.json({ success: true, content: imageUrl });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// controllers/aiController.js
import fetch from "node-fetch";

// import pdfParse from "pdf-parse";

export const removeImageObject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { prompt } = req.body; // e.g. "remove watch"
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Missing object removal prompt" });
    }

    const filePath = req.file.path;

    // Call ClipDrop API
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(filePath));
    formData.append("prompt", prompt);

    const response = await fetch("https://clipdrop-api.co/remove-object/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY
      },
      body: formData
    });

    if (!response.ok) {

      throw new Error(`ClipDrop API error: ${response.status} ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      { folder: "removed-objects" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
        }
        return res.json({ success: true, url: result.secure_url });
      }
    );

    const stream = uploadResult;
    stream.end(buffer);

  } catch (error) {
    console.error("removeImageObject error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};






import multer from "multer";
// export const upload = multer({ dest: "uploads/" });



// Resume Review Controller
// export const resumeReview = async (req, res) => {
//   try {
//     const { userId } = req.auth;
//     const resume = req.file;
//     const plan = req.plan;

//     if (plan !== "premium") {
//       return res.json({
//         success: false,
//         message: "This feature is only available for premium subscriptions",
//       });
//     }

//     if (resume.size > 5 * 1024 * 1024) {
//       return res.json({ success: false, message: "Resume file size exceeds 5MB." });
//     }

//     const dataBuffer = fs.readFileSync(resume.path);
//     const pdfData = await pdf(dataBuffer);

//     // Prompt for Markdown output
//     const prompt = `
// You are a professional career advisor. Review the resume text below and provide a detailed analysis in Markdown format with headings and bullet points.

// # Strengths
// - 

// # Weaknesses
// - 

// # Areas for Improvement
// - 

// # Suggested Roles
// - 

// # Expected Salary
// - 

// Resume Content:
// ${pdfData.text}
// `;

//     const response = await AI.chat.completions.create({
//       model: "gemini-2.0-flash",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7,
//       max_tokens: 1200
//     });

//     const content = response.choices[0].message?.content || "No content generated.";

//     // Save in database
//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type)
//       VALUES (${userId}, 'Review Resume', ${content}, 'resume')
//     `;

//     // Delete local file
//     fs.unlinkSync(resume.path); 

//     res.json({ success: true, content });
//   } catch (error) {
//     console.error("resumeReview error:", error);
//     res.json({ success: false, message: error.message });
//   }
// };


export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth;
    const resume = req.file;
    const { jobDescription } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (!jobDescription) {
      return res.json({ success: false, message: "Please provide a job description." });
    }
    if (resume.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "Resume file size exceeds 5MB." });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    // Prompt for Job Description Matching
    const prompt = `
You are a professional career advisor. Compare the resume text below with the job description and provide:

# Match Percentage
- 

# Missing Skills
- 

# Suggestions
- 
Resume Content:
${pdfData.text}

Job Description:
${jobDescription}
`;

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1200
    });

    const content = response.choices[0].message?.content || "No content generated.";

    // Save in database
     await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Job Description Matcher', ${content}, 'resume')
    `;

    // Delete local file
    fs.unlinkSync(resume.path); 

    res.json({ success: true, content });
  } catch (error) {
    console.error("resumeReview error:", error);
    res.json({ success: false, message: error.message });
  }
};
















