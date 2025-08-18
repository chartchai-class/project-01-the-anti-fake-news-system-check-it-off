// pages/comments.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CommentsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!id) return;

    async function fetchNews() {
      // ดึงจาก Sheet2
      const res = await fetch(
        `https://docs.google.com/spreadsheets/d/1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA/gviz/tq?tqx=out:json&gid=123456`
      );
      const text = await res.text();
      const json = JSON.parse(text.match(/.*?({.*}).*/s)[1]);

      // B-F = index 1-5 (0=A)
      const row = json.table.rows.find((r) => String(r.c[0]?.v) === String(id)); // สมมติ id อยู่คอลัมน์ A
      if (row) {
        setNews({
          id: row.c[0]?.v || "", // เพิ่ม id
          title: row.c[1]?.v || "",
          author: row.c[2]?.v || "",
          date: row.c[3]?.v || "",
          stats: row.c[4]?.v || "",
          comments: row.c[5]?.v || 0,
        });
      }
    }

    async function fetchComments() {
      // สมมติ Sheet2 ใช้คอลัมน์ B-F เช่นกัน
      const res = await fetch(
        `https://docs.google.com/spreadsheets/d/1xXd_djAF1jp7c5jrY-mzAwVYxSN9wbl_0RTpKKvH0AA/gviz/tq?tqx=out:json&gid=123456`
      );
      const text = await res.text();
      const json = JSON.parse(text.match(/.*?({.*}).*/s)[1]);

      // สมมติคอลัมน์ B = name, C = comment, D = newsId
      const rows = json.table.rows.filter(
        (r) => String(r.c[3]?.v) === String(id)
      );
      const parsed = rows.map((r) => ({
        name: r.c[1]?.v || "",
        comment: r.c[2]?.v || "",
      }));
      setComments(parsed);
    }

    fetchNews();
    fetchComments();
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
        Back to News List
      </button>

      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl border border-gray-100 shadow-lg h-40">
        {/* Flex container หลัก */}
        <div className="flex items-center justify-between h-full">
          {/* ซ้าย: Title + Stats */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold">
              New Climate Technology Breakthrough Announced
            </h2>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-gray-700 mt-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon/Card/like.png"
                  alt="Like"
                  width={25}
                  height={25}
                />
                <span className="text-lg">1</span>
                <span className="text-lg">Up Votes</span>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/icon/Card/DisLike.png"
                  alt="Like"
                  width={25}
                  height={25}
                />
                <span className="text-lg">1</span>
                <span className="text-lg">Down Votes</span>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/icon/Card/Comment.png"
                  alt="Like"
                  width={25}
                  height={25}
                />
                <span className="text-lg">2</span>
                <span className="text-lg">Total comments</span>
              </div>
            </div>
          </div>

          {/* ขวา: Button */}
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 h-10">
            Add Your Vote
          </button>
        </div>
      </div>

      <div>
        
      </div>
    </div>
  );
}
