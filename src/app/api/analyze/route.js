
import OpenAI from "openai";
import fs from "fs";
import pdfParse from 'pdf-parse';

// To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings. 
// Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const token = process.env["GITHUB_TOKEN"];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const company = formData.get("company");
    const title = formData.get("title");
    const description = formData.get("description");
    const resumeFile = formData.get("resume");

    if (!company || !title || !description || !resumeFile) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    let resumeContent = '';
    try {
      if (resumeFile.type === 'application/pdf') {
        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdfParse(buffer);
        resumeContent = data.text || '';
      } else {
        resumeContent = await resumeFile.text();
      }
    } catch (err) {
      console.error('Error parsing resume filehttps://github.com/marketplace:', err);
      resumeContent = '';
    }

    // Here you would typically call your AI model to analyze the resume against the job description
    // For demonstration, we'll return a mock response
 
     const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: token
  });
 
   
      const prompt = `You are a professional resume reviewer. Analyze the following resume and provide: 
         - Skills
         - Work experience
         - Education
         - Suggestions for improvement

         Resume content:
         ${resumeContent}`;

  const response = await client.chat.completions.create({


    messages: [
      { role:"system", content: "You are a professional resume reviewer." },
      { role:"user", content: prompt }
    ],
    model: "openai/gpt-4o",
    temperature: 1,
    max_tokens: 4096,
    top_p: 1
  });

  console.log("Ai Response",response.choices[0].message.content);

    const analysisResult = {
      company,
      title,
      description,
      resumeContent,
      score: Math.floor(Math.random() * 100), // Mock score
      feedback: response.choices[0].message.content 
    };

    return new Response(JSON.stringify(analysisResult), { status: 200 });
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function main() {

  
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
