import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "secret/newsdatabaseproject-168367164553.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA";
const sheetName = "Sheet1";

export default async function handler(req, res) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  // ================= GET =================
  if (req.method === "GET") {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:J`,
    });

    const rows = response.data.values || [];
    if (!rows.length) return res.status(200).json([]);

    const data = rows.slice(1).map((row) => ({
      id: row[0] || "",
      title: row[1] || "",
      stats: row[2] || "",
      description: row[3] || "",
      author: row[4] || "",
      image: row[5] || "",
      date: row[6] || "",
      upVotes: parseInt(row[7] || 0),
      downVotes: parseInt(row[8] || 0),
      comments: parseInt(row[9] || 0),
    }));

    return res.status(200).json(data);
  }

  // ================= POST =================
  if (req.method === "POST") {
    const {
      id,
      title,
      stats,
      description,
      author,
      image,
      date,
      upVotes = 0,
      downVotes = 0,
      comments = 0,
    } = req.body;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:J`,
      valueInputOption: "RAW",
      resource: {
        values: [[id, title, stats, description, author, image, date, upVotes, downVotes, comments]],
      },
    });

    return res.status(200).json({ message: "Added successfully" });
  }

  // ================= PUT =================
  if (req.method === "PUT") {
    const { rowIndex, type } = req.body;

    const rowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:J`,
    });

    const row = rowResponse.data.values[rowIndex]; // ใช้ rowIndex เป็น index ของ array (0 = header)
    if (!row) return res.status(404).json({ message: "Row not found" });

    let upVotes = parseInt(row[7] || 0);
    let downVotes = parseInt(row[8] || 0);

    if (type === "up") upVotes += 1;
    if (type === "down") downVotes += 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!H${rowIndex + 1}:I${rowIndex + 1}`,
      valueInputOption: "RAW",
      resource: { values: [[upVotes, downVotes]] },
    });

    return res.status(200).json({ message: "Voted successfully" });
  }

  res.status(405).json({ message: "Method not allowed" });
}
