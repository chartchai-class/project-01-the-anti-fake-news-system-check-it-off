import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const filePath = path.join(process.cwd(), "public", "db.json");

  try {
    const fileData = fs.readFileSync(filePath, "utf-8");
    const db = JSON.parse(fileData);

    if (req.method === "GET") {
      return res.status(200).json(db.news || []);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("API /news error:", err);
    return res.status(500).json({ error: "Failed to load news" });
  }
}
