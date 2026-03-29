
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
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

    console.log('Form fields received:');
    console.log('  company:', company);
    console.log('  title:', title);
    console.log('  description:', description);
    console.log('  resumeFile:', resumeFile ? `${resumeFile.name} (${resumeFile.type})` : null);

    if (!company || !title || !description || !resumeFile) {
      console.error('Missing required fields:', { company: !!company, title: !!title, description: !!description, resumeFile: !!resumeFile });
      return new Response(JSON.stringify({ error: "Missing required fields. Please fill in all fields." }), { status: 400 });
    }

    let resumeContent = '';
    let savedFileId = null;
    try {
      console.log('Received file type:', resumeFile.type);
      console.log('File name:', resumeFile.name);
      console.log('File size:', resumeFile.size);
      
      if (resumeFile.type === 'application/pdf') {
        const arrayBuffer = await resumeFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('Buffer size:', buffer.length);
        
        const data = await pdfParse(buffer);
        resumeContent = data.text || '';
        console.log('PDF text extracted, length:', resumeContent.length);
        
        // persist uploaded PDF to a tmp folder and return an id so it can be served later
        try {
          const id = randomUUID();
          const tmpDir = path.join(process.cwd(), 'tmp');
          console.log('Creating tmp dir at:', tmpDir);
          await fs.mkdir(tmpDir, { recursive: true });
          
          const savePath = path.join(tmpDir, `${id}.pdf`);
          console.log('Saving PDF to:', savePath);
          await fs.writeFile(savePath, buffer);
          
          // Verify file was written
          const stat = await fs.stat(savePath);
          console.log(`Successfully saved PDF: ${savePath}, size: ${stat.size} bytes, id: ${id}`);
          savedFileId = id;
        } catch (writeErr) {
          console.error('Failed to save uploaded PDF to tmp:', writeErr);
        }
      } else {
        console.log('File is not PDF, attempting to read as text');
        resumeContent = await resumeFile.text();
      }
    } catch (err) {
      console.error('Error parsing resume file:', err);
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
         
         Format your response as a JSON object

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
  console.log("fileIdS", savedFileId);

    const analysisResult = {
      company,
      title,
      description,
      resumeContent,
      fileId: savedFileId,
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
