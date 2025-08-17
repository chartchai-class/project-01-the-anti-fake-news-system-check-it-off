import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState(null);
  const commentsCount = 12;

  const handleVote = async (type) => {
  try {
    const rowIndex = parseInt(id); 
    await fetch("/api/news", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rowIndex, type }),
    });

    // update state ทันที
    setNews((prev) => ({
      ...prev,
      upVotes: type === "up" ? prev.upVotes + 1 : prev.upVotes,
      downVotes: type === "down" ? prev.downVotes + 1 : prev.downVotes,
    }));
  } catch (err) {
    console.error("Vote failed", err);
  }
};


  useEffect(() => {
  if (!id) return;

  async function fetchNews() {
    try {
      const res = await fetch(`/api/news?startRow=0&endRow=25`); // ดึง row 0–100
      const data = await res.json();
      const item = data.find((n) => n.id === id || n.id === parseInt(id));
      setNews(item);
    } catch (err) {
      console.error(err);
    }
  }

  fetchNews();
}, [id]);


  if (!news) return <p className="p-8">Loading...</p>;

  return (
    <div
      className="p-8 max-w-4xl mx-auto"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center px-3 py-1 bg-gray-100 hover:bg-blue-500 rounded shadow hover:text-white"
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

      {/* News Info */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
        <h1 className="text-3xl font-bold">{news.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span
            className={`inline-block px-2 py-1 rounded text-sm ${
              news.stats === "Verified"
                ? "bg-green-100 text-green-700"
                : news.stats === "Fake News"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {news.stats}
          </span>
          <span className="flex items-center text-gray-600">
            <Image
              src="/icon/Card/User.png"
              alt="User"
              width={20}
              height={20}
            />
            <span className="ml-2"> By {news.author}</span>
          </span>

          <span className="text-gray-600">{news.date}</span>
        </div>

        {/* News Image */}
{news.image && (
  <div className="w-full h-64 relative mb-4">
    <Image
      src={news.image}
      alt={news.title}
      fill
      style={{ objectFit: "cover" }}
      className="rounded-lg"
    />
  </div>
)}

<h1 className="text-3xl font-bold">{news.title}</h1>


        {/* Votes and Comments */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <button className="flex items-center gap-1 px-3 py-1 bg-green-50 hover:bg-green-100 rounded">
            <Image
              src="/icon/Card/Like.png"
              alt="Like"
              width={20}
              height={20}
            />
            {news.upVotes}
          </button>

          <button className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 rounded">
            <Image
              src="/icon/Card/Dislike.png"
              alt="Dislike"
              width={20}
              height={20}
            />
            {news.downVotes}
          </button>

          <button className="flex items-center gap-1 px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded">
            <Image
              src="/icon/Card/Comment.png"
              alt="Comment"
              width={20}
              height={20}
            />
            {news.comments} Comments
          </button>
        </div>

        {/* News Description */}
        <div className="mt-4 text-gray-700">{news.description}</div>

        <div className="h-px bg-gray-300 w-full"></div>

        {/* Optional: Add more buttons like "View Full Comments" */}
        <div className="mt-6 flex gap-4 ">
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Vote on This News
          </button>

          <button className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            View More Comments ({commentsCount})
          </button>
        </div>
      </div>
    </div>
  );
}
