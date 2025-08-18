import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "secret/newsdatabaseproject-168367164553.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { rowIndex } = req.body;
  if (!rowIndex) return res.status(400).json({ success: false, error: "rowIndex is required" });

  try {
    // อ่านค่า upVotes/downVotes จาก H/I
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `H${rowIndex}:I${rowIndex}`,
    });

    const [upVotes, downVotes] = result.data.values[0].map(Number);

    let updatedStats = "Under Review";
    if (upVotes > downVotes) updatedStats = "Verified";
    else if (downVotes > upVotes) updatedStats = "Fake News";

    // อัปเดต Column C
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `C${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[updatedStats]] },
    });

    res.status(200).json({ success: true, updatedStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}
