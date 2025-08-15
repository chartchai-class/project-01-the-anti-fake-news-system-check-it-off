import { useState } from "react";
import Header from "../components/Header";

export default function Home() {
  const stats = [
    { label: "Total News", value: 6, icon: "" },
    { label: "Verified", value: 3, icon: "" },
    { label: "Fake News", value: 2, icon: "" },
    { label: "Under Review", value: 1, icon: "" },
  ];

  const newsData = [
    {
      id: 1,
      title: "New Climate Technology Breakthrough Announced",
      status: "Verified",
      description:
        "Scientists claim to have developed revolutionary carbon capture technology that could reverse climate change within a decade.",
      author: "Dr. Sarah Chen",
      date: "over 1 year ago",
      upVotes: 46,
      downVotes: 23,
      comments: 3,
    },
    {
      id: 2,
      title: "Local Mayor Announces Free Public Transportation",
      status: "Verified",
      description:
        "City mayor declares all public transportation will be free starting next month, funded by new tech company partnerships.",
      author: "James Wilson",
      date: "over 1 year ago",
      upVotes: 89,
      downVotes: 5,
      comments: 2,
    },
    {
      id: 3,
      title: "Celebrity Spotted with Alien Technology",
      status: "Fake News",
      description:
        "Famous actor photographed using device that allegedly allows communication with extraterrestrial beings.",
      author: "Anonymous Source",
      date: "over 1 year ago",
      upVotes: 12,
      downVotes: 156,
      comments: 2,
    },
  ];

  const [filter, setFilter] = useState("All News");
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const filteredNews =
    filter === "All News"
      ? newsData
      : newsData.filter((n) => n.status === filter);

  return (
    <div className="p-8">
      
      <Header stats={stats} />

      {/* Filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          {["All News", "Verified", "Fake News", "Under Review"].map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={`px-4 py-2 rounded ${
                filter === btn
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {btn}
            </button>
          ))}
        </div>
        <div>
          <label className="mr-2 text-gray-700">Items per page:</label>
          <select
            className="border rounded px-2 py-1"
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
        {filteredNews.map((news) => (
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
                {news.status}
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
