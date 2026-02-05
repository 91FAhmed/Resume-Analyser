
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  title: "Analysis — Resume Analyzer",
  description:
    "Analysis helps you analyze resumes, detect ATS compatibility scores, and provides actionable improvement tips to increase hiring chances.",
  keywords: [
    "resume",
    "ATS",
    "resume analysis",
    "resume tips",
    "ATS score",
    "resume optimization",
    "job application",
  ],
  authors: [{ name: " Ahmed" }],
  themeColor: "#0f172a",
  openGraph: {
    title: "Analysis — Resume Analyzer",
    description:
      "Analyze your resume, get an ATS compatibility score, and receive practical improvement tips to pass applicant tracking systems.",
    url: "https://resume-analyser-k4hr.vercel.app/",
    siteName: "Analysis",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Analysis — Resume Analyzer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Analysis — Resume Analyzer",
    description:
      "Analyze your resume, get an ATS score, and receive actionable tips to improve it.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <main
      className="max-w-full min-h-screen  bg-bg-default text-fg-default"
      style={{
        backgroundImage: "url('/images/bg-main.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    > 
     
        {children}
        </main>
      </body>
    </html>
  );
}
