import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  const filePath = path.join(process.cwd(), "db.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  if (req.method === "GET") {
    return res.status(200).json(data.news || []);
  }

  res.status(405).json({ message: "Method not allowed" });
}
