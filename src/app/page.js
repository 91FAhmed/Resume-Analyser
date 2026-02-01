import Navbar from "@/components/Navbar";
import ResumeCard from "@/components/ResumeCard";
import { resumes } from "@/constants";
export default function Home() {
  return (
    <>

     <main className="mt-12">
         <Navbar children={"Upload Resume"} />
   <section className="max-w-4xl mx-auto container-fix px-4 sm:px-6 lg:px-8">
    <div className="py-12 sm:py-20 text-center">
      <h1 className="mask-[auto_100px] mask-l-from-75% mask-r-from-80%  font-semibold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight max-w-4xl mx-auto">Track Your Resume Applications 💼 & Resume Ratings 🌟🌟🌟</h1>
      <p className="mt-6 text-gray-500 text-sm max-w-sm  font-semibold lg:text-lg text-foreground-muted lg:max-w-2xl mx-auto">
        Simplify your job search with our Resume Application Tracker and Rating System. Monitor your applications and get instant feedback on your resume's effectiveness.
      </p>
    </div>
   </section>
   {resumes.length > 0 && (
    <section className="max-w-6xl mx-auto container-fix px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20 grid gap-6 sm:grid-cols-2 mt-8">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </section>
   )}
   </main>
 
   </>
  );
}
