export default async function handler(req, res) {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA/gviz/tq?tqx=out:json';
  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();

    // แปลง JSON ของ Google Sheet
    const json = JSON.parse(text.substring(47).slice(0, -2));

    res.status(200).json(json.table.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
