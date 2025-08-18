// lib/sheetWriter.js
import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "secret/newsdatabaseproject-168367164553.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA"; // ต้องตรงกับที่ใช้ในฟังก์ชัน
const sheetName = "Sheet1";

/**
 * updateStatsByVotes
 * @param {number} rowIndex - แถวของข่าวใน Sheet (1-based)
 * Column H = upVotes, Column I = downVotes
 * จะอัปเดต Column C = stats ("Verified" / "Fake News")
 */
export async function updateStatsByVotes(rowIndex) {
  try {
    // อ่านค่าปัจจุบันจาก H และ I
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `H${rowIndex}:I${rowIndex}`,
    });

    const [upVotes, downVotes] = res.data.values[0].map(Number);

    let updatedStats = "Under Review";
    if (upVotes > downVotes) updatedStats = "Verified";
    else if (downVotes > upVotes) updatedStats = "Fake News";

    // อัปเดต column C
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `C${rowIndex}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[updatedStats]] },
    });

    return { success: true, updatedStats };
  } catch (err) {
    console.error("Error updating stats:", err);
    return { success: false, error: err.message };
  }
}
