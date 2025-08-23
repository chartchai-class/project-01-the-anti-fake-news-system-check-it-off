// pages/api/news.js
import { google } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEET_ID;
const sheetName = "Sheet1";
const commentsSheet = "Sheet2"; // ชื่อ sheet สำหรับคอมเมนต์

// สร้าง auth client จาก env
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export default async function handler(req, res) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  // ================= GET =================
  if (req.method === "GET") {
    try {
      res.setHeader("Cache-Control", "no-store");

      // ดึงข่าวจาก Sheet1
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:K`,
      });

      const rows = response.data.values || [];
      if (!rows.length) return res.status(200).json([]);

      // ดึงคอมเมนต์จาก Sheet2
      const commentsRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${commentsSheet}!A:E`, // A: newsId
      });
      const commentsRows = commentsRes.data.values || [];

      // Map ข้อมูล
      const data = rows.slice(1).map((row) => {
        const id = row[0] || "";
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
          upVotes: parseInt(row[7] || 0),
          downVotes: parseInt(row[8] || 0),
          comments: commentCount,
        };
      });

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch data" });
    }
  }

  // ================= POST =================
  if (req.method === "POST") {
    try {
      const {
        id,
        title,
        stats,
        description,
        fullDescription,
        author,
        image,
        date,
        upVotes = 0,
        downVotes = 0,
        comments = 0,
      } = req.body;

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:K`,
        valueInputOption: "RAW",
        resource: {
          values: [
            [
              id,
              title,
              stats,
              description,
              fullDescription,
              author,
              image,
              date,
              upVotes,
              downVotes,
              comments,
            ],
          ],
        },
      });

      return res.status(200).json({ message: "Added successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to add news" });
    }
  }

  // ================= PUT =================
  if (req.method === "PUT") {
    try {
      const { id, type } = req.body;

      // ดึงทุกแถว
      const rowResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:K`,
      });

      const rows = rowResponse.data.values || [];
      const headerOffset = 1; // เพราะ row[0] เป็น header

      const rowIndex = rows.findIndex((r, i) => i >= headerOffset && r[0] === String(id));
      if (rowIndex === -1) return res.status(404).json({ message: "News item not found" });

      const row = rows[rowIndex];
      let upVotes = parseInt(row[7] || 0);
      let downVotes = parseInt(row[8] || 0);

      if (type === "up") upVotes += 1;
      if (type === "down") downVotes += 1;

      const sheetRow = rowIndex + 1; // +1 เพราะ Google Sheets นับจาก 1

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!H${sheetRow}:I${sheetRow}`,
        valueInputOption: "RAW",
        resource: { values: [[upVotes, downVotes]] },
      });

      return res.status(200).json({ message: "Voted successfully", upVotes, downVotes });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update votes" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
