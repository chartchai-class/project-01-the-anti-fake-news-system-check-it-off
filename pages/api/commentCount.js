import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA";
const sheetComments = "Sheet2";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { newsId } = req.query;
    if (!newsId) return res.status(400).json({ error: "Missing newsId" });

    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });
    const readComments = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetComments}!A:A`, // คอลัมน์ A คือ id ของข่าว
    });

    const commentRows = readComments.data.values || [];
    const count = commentRows.filter((row) => row[0] === newsId.toString()).length;

    res.status(200).json({ count });
  } catch (err) {
    console.error("Comment count error:", err);
    res.status(500).json({ error: "Failed to get comment count" });
  }
}
