// pages/comments.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CommentsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);

  const goToVotePage = () => {
    router.push(`/vote?id=${news.id}`);
  };

  useEffect(() => {
    if (!id) return;

    async function fetchSheet1Data() {
      try {
        const SHEET1_GID = "0"; // gid ของ Sheet1 (เปลี่ยนตามจริง)
        const res = await fetch(
          `https://docs.google.com/spreadsheets/d/1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA/gviz/tq?tqx=out:json&gid=${SHEET1_GID}`
        );
        const text = await res.text();
        const json = JSON.parse(text.match(/.*?({.*}).*/s)[1]);

        // หาข่าวเดียวที่ตรงกับ id
        const newsRow = json.table.rows.find(
          (r) => String(r.c[0]?.v) === String(id)
        );

        if (newsRow) {
          setNews({
            id: newsRow.c[0]?.v || "",
            title: newsRow.c[1]?.v || "",
            stats: newsRow.c[2]?.v || "",
            description: newsRow.c[3]?.v || "",
            author: newsRow.c[4]?.v || "",
            image: newsRow.c[5]?.v || "",
            date: newsRow.c[6]?.v || "",
            upVotes: newsRow.c[7]?.v || 0,
            downVotes: newsRow.c[8]?.v || 0,
            commentsCount: newsRow.c[9]?.v || 0,
            fullDescription: newsRow.c[10]?.v || "",
          });
        }
      } catch (err) {
        console.error("Error fetching Sheet1 data:", err);
      }
    }

    async function fetchSheet2Data() {
      try {
        const SHEET2_GID = "586997555";
        const res = await fetch(
          `https://docs.google.com/spreadsheets/d/1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA/gviz/tq?tqx=out:json&gid=${SHEET2_GID}`
        );
        const text = await res.text();
        const json = JSON.parse(text.match(/.*?({.*}).*/s)[1]);

        const filteredComments = json.table.rows
          .filter((r) => String(r.c[0]?.v) === String(id)) // กรองด้วย newsId
          .map((r) => ({
            name: r.c[1]?.v || "Anonymous",
            status: r.c[2]?.v || "",
            comment: r.c[3]?.v || "",
            imageUrl: r.c[4]?.v || "",
            date: r.c[5]?.v || "",
          }));

        setComments(filteredComments);
      } catch (err) {
        console.error("Error fetching Sheet2 data:", err);
      }
    }

    fetchSheet1Data();
    fetchSheet2Data();
  }, [id]);

  if (!news) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="p-8 max-w-4xl mx-auto"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-300 rounded shadow"
      >
        <Image
          src="/icon/Card/Back.png"
          alt="Back"
          width={20}
          height={20}
          className="mr-2"
        />
        Back to News Details
      </button>

      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-300 shadow-lg h-40">
        <div className="flex items-center justify-between h-full">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">{news.title}</h2>

            <div className="flex flex-wrap gap-6 text-gray-700 mt-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon/Card/like.png"
                  alt="Like"
                  width={25}
                  height={25}
                />
                <span className="text-lg">{news.upVotes}</span>
                <span className="text-lg">Up Votes</span>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/icon/Card/DisLike.png"
                  alt="Dislike"
                  width={25}
                  height={25}
                />
                <span className="text-lg">{news.downVotes}</span>
                <span className="text-lg">Down Votes</span>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/icon/Card/Comment.png"
                  alt="Comment"
                  width={25}
                  height={25}
                />
                <span className="text-lg">{comments.length}</span>
                <span className="text-lg">Total comments</span>
              </div>
            </div>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 h-10"
            onClick={goToVotePage}
          >
            Add Your Vote
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4">Comments & Votes</h3>

      <div className="mt-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((c, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 py-3 flex items-start gap-3"
            >
              <div className="flex-1 flex flex-col gap-1 break-words">
                {/* บรรทัดบน: Name + Status */}
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{c.name}</p>
                  {c.status && (
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm ${
                        c.status === "up"
                          ? "bg-green-100 text-green-700"
                          : c.status === "down"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.status === "up"
                        ? "Real"
                        : c.status === "down"
                        ? "Fake"
                        : c.status}
                    </span>
                  )}
                </div>

                {/* บรรทัดล่าง: Comment + Date */}
                <div className="flex flex-col gap-1">
                  {c.comment && <p>{c.comment}</p>}
                  {c.date && <p className="text-xs text-gray-400">{c.date}</p>}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
