import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
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
  authors: [{ name: "Ahmed" }],
  themeColor: "#FFFBFE",
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
      <body className={`${nunito.variable} antialiased`} style={{ margin: 0, background: "#FFFBFE" }}>
        {children}
      </body>
      <Script
        src="https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/wasm/openjpeg_nowasm_fallback.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/pdfjs-dist@5.5.207/web/pdf_viewer.min.css"
        strategy="afterInteractive"
        />
    </html>
  );
}