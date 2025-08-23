// It is API route collecting data from Google Sheets News Database
import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(
    process.cwd(),
    "secret/newsdatabaseproject-168367164553.json"
  ),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA";
const sheetName = "Sheet1";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  // GET method
  if (req.method === "GET") {
    // ดึงข่าวจาก Sheet1
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:K`,
    });
    const rows = response.data.values || [];
    if (!rows.length) return res.status(200).json([]);

    // ดึงคอมเมนต์จาก Sheet2
    const COMMENTS_SHEET = "Sheet2"; // เปลี่ยนเป็นชื่อ Sheet2 ของคุณ
    const commentsRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${COMMENTS_SHEET}!A:E`, // A: newsId, B: name, ...
    });
    const commentsRows = commentsRes.data.values || [];

    const data = rows.slice(1).map((row) => {
      const id = row[0] || "";

    
      const commentCount = commentsRows.filter((c) => c[0] === id).length;

      return {
        id: String(id),
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
  }

  // ================= POST =================
  if (req.method === "POST") {
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
  }

  // ================= PUT =================
  if (req.method === "PUT") {
    const { rowIndex, type } = req.body;

    const rowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:K`,
    });

    const row = rowResponse.data.values[rowIndex];
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

  if (req.method === "PUT") {
    const { id, type } = req.body;

    const rowResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:K`,
    });

    const rows = rowResponse.data.values || [];
    const headerOffset = 1;

    const rowIndex = rows.findIndex(
      (r, i) => i >= headerOffset && r[0] === String(id)
    );
    if (rowIndex === -1) {
      return res.status(404).json({ message: "News item not found" });
    }

    const row = rows[rowIndex];
    let upVotes = parseInt(row[7] || 0);
    let downVotes = parseInt(row[8] || 0);

    if (type === "up") upVotes += 1;
    if (type === "down") downVotes += 1;

    const sheetRow = rowIndex + 1;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!H${sheetRow}:I${sheetRow}`,
      valueInputOption: "RAW",
      resource: { values: [[upVotes, downVotes]] },
    });

    return res
      .status(200)
      .json({ message: "Voted successfully", upVotes, downVotes });
  }

  res.status(405).json({ message: "Method not allowed" });
}
