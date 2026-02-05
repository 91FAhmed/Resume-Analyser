"use client"

import React, { useState } from 'react'

const page = () => {
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append('company', company);
    formData.append('title', title);
    formData.append('description', description);
    if (resume) formData.append('resume', resume, resume.name);

    const res = await fetch('/api/analyze',{
      method: 'POST',
      body: formData
    });
    try {
      const data = await res.json();
      console.log(data);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to parse server response');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight">
            Smart feedback
            <br />
            <span className="bg-gradient-to-r from-gray-800 to-violet-600 bg-clip-text text-transparent">for your dream job</span>
          </h1>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Drop your resume for an ATS score and improvement tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="grid gap-4">
            <label className="font-semibold">Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              className="border p-3 rounded-lg w-full"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <label className="font-semibold">Job Title</label>
            <input
              type="text"
              placeholder="Job Title"
              className="border p-3 rounded-lg w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="font-semibold">Job Description</label>
            <textarea
              rows={4}
              placeholder="Job Description"
              className="border p-3 rounded-lg w-full resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label className="font-semibold">Upload Resume</label>
            <label className="relative flex items-center justify-center flex-col border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 hover:border-violet-500 hover:text-violet-600 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16v-4a4 4 0 014-4h2a4 4 0 014 4v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20h10" />
              </svg>
              <div className="text-sm font-medium">Click to upload or drag and drop PDF (max 20 MB)</div>
              <input 
                type="file" 
                accept="application/pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </label>

            <button type="submit" className="mt-2 w-full inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Analyze Resume
            </button>
          </div>
        </form>
        {loading && (
          <div className="mt-6 text-center text-sm text-gray-500">Uploading & analyzing…</div>
        )}

        {error && (
          <div className="mt-6 text-center text-sm text-red-600">{error}</div>
        )}

        {result && (
          <div className="mt-8 bg-white/90 rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <p className="text-sm text-gray-600 mt-2">File: {result.filename ?? '—' } ({result.size ?? 0} bytes)</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="rounded-full bg-violet-100 text-violet-700 w-20 h-20 flex items-center justify-center text-2xl font-bold">{result.score ?? '—'}</div>
              <div>
                <h3 className="font-semibold">Improvement Tips</h3>
                <ul className="list-disc list-inside text-sm mt-2">
                  {(result.tips || []).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default page