import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA";
const sheetComments = "Sheet2";
const sheetNews = "Sheet1";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { newsId } = req.query;
    if (!newsId) return res.status(400).json({ error: "Missing newsId" });

    const sheets = google.sheets({
      version: "v4",
      auth: await auth.getClient(),
    });

    const readComments = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetComments}!A:A`,
    });

    const commentRows = readComments.data.values || [];
    const commentCount = commentRows.filter(
      (row) => row[0] === newsId.toString()
    ).length;

     const readNews = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetNews}!A:I`,
    });
    const newsRows = readNews.data.values || [];
    const rowIndex = newsRows.findIndex((r) => r[0] === newsId.toString());

    let upVotes = 0;
    let downVotes = 0;
    if (rowIndex !== -1) {
      upVotes = parseInt(newsRows[rowIndex][7] || "0", 10);
      downVotes = parseInt(newsRows[rowIndex][8] || "0", 10);
    }

    res.status(200).json({ commentCount, upVotes, downVotes });
  } catch (err) {
    console.error("Comment count error:", err);
    res.status(500).json({ error: "Failed to get comment count" });
  }
}
