export default function NewsCard({ news }) {
  return (
    <div className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between">
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
  );
}
