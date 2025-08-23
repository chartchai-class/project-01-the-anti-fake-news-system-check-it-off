// pages/news/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function NewsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState(null);

  const goToVotePage = () => {
    router.push(`/vote?id=${news.id}`);
  };

  const goToCommentsPage = () => {
    router.push(`/comments?id=${news.id}`);
  };

  useEffect(() => {
    if (!id) return;

    async function fetchNews() {
      try {
        const res = await fetch("/db.json"); // fetch db.json
        const data = await res.json();

        // ดึงข่าวตาม id
        const item = data.news.find(
          (n) => n.id === id || n.id === String(id) || n.id === parseInt(id)
        );

        if (item) {
          let updatedStats = "Under Review";
          if (item.upVotes > item.downVotes) updatedStats = "Verified";
          else if (item.downVotes > item.upVotes) updatedStats = "Fake News";

          const commentCount = data.comments.filter(
            (c) => c.newsId === item.id || c.newsId === String(item.id)
          ).length;

          // แก้ path ของ image ให้เป็น absolute path สำหรับ Next.js
          const imageSrc =
            item.image?.startsWith("/")
              ? item.image
              : item.image
              ? `/${item.image}`
              : null;

          setNews({
            ...item,
            stats: updatedStats,
            comments: commentCount,
            image: imageSrc,
          });
        }
      } catch (err) {
        console.error("Failed to fetch db.json:", err);
      }
    }

    fetchNews();
  }, [id]);

  if (!news) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
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

      <div className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
        <h1 className="text-3xl font-bold">{news.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span
            className={`inline-block px-2 py-1 rounded text-lg ${
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

        <div className="flex flex-wrap items-center gap-4 mt-2">
          <button className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded">
            <Image src="/icon/Card/Like.png" alt="Like" width={20} height={20} />
            {news.upVotes}
          </button>

          <button className="flex items-center gap-1 px-3 py-1 bg-red-50 rounded">
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

        <div className="mt-4 text-gray-700 whitespace-pre-line">
          {news.fullDescription || news.description}
        </div>

        <div className="h-px bg-gray-300 w-full"></div>

        <div className="mt-6 flex gap-4">
          <button
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={goToVotePage}
          >
            Vote on This News
          </button>

          <button
            className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={goToCommentsPage}
          >
            View More Comments ({news.comments})
          </button>
        </div>
      </div>
    </div>
  );
}
