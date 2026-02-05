import { NextResponse } from "next/server";
// load pdf-parse dynamically inside the handler to avoid module-eval side-effects
import OpenAI from 'openai'

export const runtime = 'nodejs';

async function callOpenAI(prompt) {
  const token = process.env.GITHUB_TOKEN || process.env.OPENAI_API_KEY
  if (!token) throw new Error('GITHUB_TOKEN or OPENAI_API_KEY not set')

  const client = new OpenAI({ apiKey: token, baseURL: 'https://models.github.ai/inference' })

  const model = process.env.OPENAI_MODEL || 'openai/gpt-4o'
  const resp = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: 'You are an expert resume reviewer and ATS specialist. Return a JSON object with numeric "score" (0-100) and array "tips" (3 short suggestions).' },
      { role: 'user', content: prompt }
    ],
    temperature: 1,
    max_tokens: 800
  })

  const assistant = resp?.choices?.[0]?.message?.content || ''
  try {
    return JSON.parse(assistant)
  } catch (e) {
    return { raw: assistant }
  }
}

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get('resume'); // File object
    const company = form.get('company') || '';
    const title = form.get('title') || '';
    const description = form.get('description') || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // extract text from PDF (dynamic import to avoid package side-effects at module load)
    const buffer = Buffer.from(await file.arrayBuffer())
    let text = ''
    try {
      const { default: pdf } = await import('pdf-parse')
      const data = await pdf(buffer)
      text = data.text || ''
    } catch (err) {
      console.error('PDF parse error', err)
    }

    const prompt = `Company: ${company}\nJob title: ${title}\nJob description: ${description}\n\nResume text:\n${text.slice(0, 30000)}`

    let analysis = { score: 85, tips: ['Use more action verbs', 'Quantify achievements'] }
    try {
      const ai = await callOpenAI(prompt)
      analysis = { score: ai.score ?? analysis.score, tips: ai.tips ?? analysis.tips }
    } catch (err) {
      console.error('OpenAI error', err)
    }

    return NextResponse.json({
      message: 'Resume analyzed',
      filename: file.name,
      size: file.size,
      score: analysis.score,
      tips: analysis.tips
    })
  } catch (err) {
    console.error('Route handler error', err)
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 })
  }
}