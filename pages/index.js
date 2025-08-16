import { useEffect, useState } from "react";
import Header from "../components/Header";

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
          <div
            key={news.id}
            className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold mb-1">{news.title}</h2>
              <span
                className={`inline-block px-2 py-1 rounded text-sm mb-2 ${
                  news.status === "Verified"
                    ? "bg-green-100 text-green-700"
                    : news.status === "Fake News"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {news.stats}
              </span>
              <p className="text-gray-700 text-sm mb-2">{news.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                By {news.author} • {news.date}
              </p>
            </div>

            <div className="flex justify-between items-center text-sm mt-4">
              <div className="flex space-x-4">
                <span className="text-green-600">👍 {news.upVotes}</span>
                <span className="text-red-600">👎 {news.downVotes}</span>
                <span className="text-gray-600">💬 {news.comments}</span>
              </div>
              <button className="border rounded px-3 py-1 hover:bg-gray-100">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
