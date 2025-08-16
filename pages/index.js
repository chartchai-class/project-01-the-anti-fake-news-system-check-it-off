import { useEffect, useState } from "react";
import Header from "../components/Header";
import NewsCard from "../components/NewsCard";

export default function Home() {
  const [newsData, setNewsData] = useState([]);
  const [filter, setFilter] = useState("All News");
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => setNewsData(data.NewData))
      .catch((error) => console.error("Error fetching news data:", error));
  }, []);

  const filteredNews =
    filter === "All News"
      ? newsData
      : newsData.filter((n) => n.stats === filter);

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
              className={`px-4 py-2 rounded-lg font-bold text-md ${
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredNews.slice(0, itemsPerPage).map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  );
}
