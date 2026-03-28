import Script from "next/script";

export default function PDFPage() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/pdfjs-dist/build/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("PDF.js loaded", window.pdfjsLib);
          const loadingTask = window.pdfjsLib.getDocument("test.pdf");
          loadingTask.promise.then((pdf) => {
            pdf.getPage(1).then((page) => {
              const canvas = document.getElementById("pdf-canvas");
              const context = canvas.getContext("2d");
              const viewport = page.getViewport({ scale: 1.5});
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              page.render({ canvasContext: context, viewport });
            });
          });
        }}
      />
      <canvas id="pdf-canvas"></canvas>
    </>
  );
}