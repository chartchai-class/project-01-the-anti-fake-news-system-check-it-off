// pages/api/news.js
import { google } from "googleapis";

const spreadsheetId = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA";
const sheetName = "Sheet1";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // ใช้ Service Account จาก Environment Variable
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Fetch Sheet1 (News)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:K`,
    });

    const rows = response.data.values || [];
    if (!rows.length) return res.status(200).json([]);

    // Fetch Sheet2 (Comments)
    const commentsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Sheet2!A:E`,
    });
    const commentsRows = commentsRes.data.values || [];

    // Map rows to objects
    const data = rows.slice(1) // skip header
      .filter((row) => row[0] && row[1]) // id & title must exist
      .map((row) => {
        const id = String(row[0]);
        const commentCount = commentsRows.filter((c) => c[0] === id).length;

        return {
          id,
          title: row[1] || "",
          stats: row[2] || "",
          description: row[3] || "",
          fullDescription: row[10] || "",
          author: row[4] || "",
          image: row[5] ? `/news/images/${row[5]}` : "",
          date: row[6] || "",
          upVotes: Number(row[7]) || 0,
          downVotes: Number(row[8]) || 0,
          comments: commentCount,
        };
      });

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching news:", err);
    return res.status(200).json([]); // ไม่ crash หน้า Home
  }
}
