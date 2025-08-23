// pages/index.js
import { useEffect, useState } from "react";
import Header from "../components/Header";
import NewsCard from "../components/NewsCard";

export default function Home() {
  const [newsList, setNewsList] = useState([]);
  const [filter, setFilter] = useState("All News");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [newsLoaded, setNewsLoaded] = useState(false);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/sheets");
        const data = await res.json();
          console.log(data);

        // สมมติว่า data เป็น array ของ rows จาก Sheet
        // แปลงเป็น object ให้เหมือน news
        const formattedNews = data.map((row, index) => ({
          id: index + 1,
          title: row[0] || "No Title",
          description: row[1] || "No Description",
          stats: row[2] || "Under Review",
          upVotes: parseInt(row[3]) || 0,
          downVotes: parseInt(row[4]) || 0,
          author: row[5] || "Anonymous",
          date: row[6] || "Unknown",
          image: row[7] || "/placeholder.png",
        }));

        const updatedNews = updateStats(formattedNews);
        setNewsList(updatedNews);
        setNewsLoaded(true);
      } catch (err) {
        console.error(err);
      }
    }
    fetchNews();
  }, []);

  function updateStats(newsArray) {
    return newsArray.map((news) => {
      if (news.stats === "Under Review") {
        if (news.upVotes > news.downVotes) {
          return { ...news, stats: "Verified" };
        } else if (news.downVotes > news.upVotes) {
          return { ...news, stats: "Fake News" };
        }
      }
      return news;
    });
  }

  const filteredNews =
    filter === "All News"
      ? newsList
      : newsList.filter((n) => n.stats === filter);

  const loadMore = () => {
    if (itemsPerPage === 6) setItemsPerPage(12);
    else if (itemsPerPage === 12) setItemsPerPage(24);
  };

  return (
    <div className="p-8">
      <Header />

      {/* Filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          {["All News", "Verified", "Fake News", "Under Review"].map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-4 py-2 rounded-lg text-md ${
                filter === btn
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 text-gray-700"
              }`}
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              {btn}
            </button>
          ))}
        </div>
        <div>
          <label
            className="mr-2 text-gray-700 font-bold"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Items per page :
          </label>
          <select
            className="border rounded px-2 py-1 border-gray-300 text-gray-700 font-bold"
            style={{ fontFamily: "Outfit, sans-serif" }}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
          >
            {[6, 12, 24].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredNews.slice(0, itemsPerPage).map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </div>

      {newsLoaded && itemsPerPage < filteredNews.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            More
          </button>
        </div>
      )}
    </div>
  );
}
