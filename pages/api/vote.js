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
const sheetNews = "Sheet1";
const sheetComments = "Sheet2";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, type, name, comment, imageUrl } = req.body;
    const sheets = google.sheets({
      version: "v4",
      auth: await auth.getClient(),
    });

    // 1️⃣ อัปเดต vote ใน Sheet1
    const readNews = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetNews}!A:I`,
    });

    const newsRows = readNews.data.values || [];
    const rowIndex = newsRows.findIndex((r) => r[0] === id.toString());
    if (rowIndex === -1)
      return res.status(404).json({ error: "News not found" });

    let upVotes = parseInt(newsRows[rowIndex][7] || "0", 10);
    let downVotes = parseInt(newsRows[rowIndex][8] || "0", 10);
    if (type === "up") upVotes++;
    if (type === "down") downVotes++;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetNews}!H${rowIndex + 1}:I${rowIndex + 1}`,
      valueInputOption: "RAW",
      resource: { values: [[upVotes, downVotes]] },
    });

    let updatedStatus = "Under Review";
    if (upVotes > downVotes) updatedStatus = "Verified";
    else if (downVotes > upVotes) updatedStatus = "Fake News";

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetNews}!C${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [[updatedStatus]] },
    });

    const readComments = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetComments}!A:E`,
    });

    const commentRows = readComments.data.values || [];

    const newComment = [
      id,
      name,
      type,
      comment || "",
      imageUrl || "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetComments}!A:E`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [newComment] },
    });

    res.status(200).json({
      success: true,
      upVotes,
      downVotes,
      stats: updatedStatus,
      comment: newComment,
    });
  } catch (err) {
    console.error("Vote & Comment error:", err);
    res.status(500).json({ error: "Failed to submit vote & comment" });
  }
}
