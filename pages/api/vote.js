// It is API route collecting data from Google Sheets Vote Database
import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "secret/newsdatabaseproject-168367164553.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const spreadsheetId = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA";
const sheetName = "Sheet1";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, type } = req.body;
    const sheets = google.sheets({ version: "v4", auth: await auth.getClient() });

    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:I`,
    });

    const rows = readRes.data.values || [];
    const rowIndex = rows.findIndex((r) => r[0] === id.toString());

    if (rowIndex === -1) {
      return res.status(404).json({ error: "News not found" });
    }

    let upVotes = parseInt(rows[rowIndex][7] || "0", 10);
    let downVotes = parseInt(rows[rowIndex][8] || "0", 10);

    if (type === "up") upVotes++;
    if (type === "down") downVotes++;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!H${rowIndex + 1}:I${rowIndex + 1}`,
      valueInputOption: "RAW",
      resource: { values: [[upVotes, downVotes]] },
    });

    res.status(200).json({ success: true, upVotes, downVotes });
  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ error: "Failed to update vote" });
  }
}
