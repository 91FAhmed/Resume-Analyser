import React from 'react'

const page = () => {
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

        <form className="mt-10 bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="grid gap-4">
            <label className="font-semibold">Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              className="border p-3 rounded-lg w-full"
            />

            <label className="font-semibold">Job Title</label>
            <input
              type="text"
              placeholder="Job Title"
              className="border p-3 rounded-lg w-full"
            />

            <label className="font-semibold">Job Description</label>
            <textarea
              rows={4}
              placeholder="Job Description"
              className="border p-3 rounded-lg w-full resize-none"
            />

            <label className="font-semibold">Upload Resume</label>
            <label className="relative flex items-center justify-center flex-col border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 hover:border-violet-500 hover:text-violet-600 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16v-4a4 4 0 014-4h2a4 4 0 014 4v4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20h10" />
              </svg>
              <div className="text-sm font-medium">Click to upload or drag and drop PDF (max 20 MB)</div>
              <input type="file" accept="application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </label>

            <button type="submit" className="mt-2 w-full inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform">
              Analyze Resume
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export default page