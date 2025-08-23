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

  if (req.method === "GET") {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:K`,
      });

      const rows = response.data.values || [];
      if (!rows.length) return res.status(200).json([]);

      const commentsRes = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `Sheet2!A:E`,
      });
      const commentsRows = commentsRes.data.values || [];

      const data = rows
        //.slice(1) // ลองเอาออกถ้า row แรกเป็นข้อมูลจริง
        .filter((row) => row[0] && row[1])
        .map((row) => {
          const id = row[0];
          const commentCount = commentsRows.filter(
            (c) => String(c[0]) === String(id)
          ).length;
          return {
            id: String(id),
            title: row[1],
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
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
