import fs from "fs/promises";
import path from "path";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  let filePath;
  if (id) {
    // serve uploaded temp file by id
    filePath = path.join(process.cwd(), "tmp", `${id}.pdf`);
  } else {
    const useName = name || "test.pdf";
    filePath = path.join(process.cwd(), "public", useName);
  }
  try {
    const data = await fs.readFile(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=\"${name || id || "resume.pdf"}\"`,        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",      },
    });
  } catch (err) {
    return new Response("Not found", { status: 404 });
  }
}