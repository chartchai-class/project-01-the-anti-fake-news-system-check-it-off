import Image from "next/image";
import Link from "next/link";

export default function NewsCard({ news }) {
  return (
    <div
      className="bg-white border rounded-lg shadow p-4 flex flex-col justify-between border-gray-200 
     hover:shadow-lg hover:-translate-y-1 transform transform transition duration-300 group"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <div>
        <div className="flex items-center mb-1 justify-between">
          <h2 className="text-xl font-semibold mb-1 transition-colors duration-300 group-hover:text-blue-600">
            {news.title}{" "}
          </h2>
          <span
            className={`inline-block px-2 py-1 rounded text-md mb-2 ${
              news.stats === "Verified"
                ? "bg-green-100 text-green-700"
                : news.stats === "Fake News"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {news.stats}
          </span>
        </div>
        <p className="text-gray-700 text-md mb-2">{news.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          By {news.author} • {news.date}
        </p>
      </div>

      <div className=" items-center text-sm mt-4">
        <div className="flex space-x-4">
          <span className="flex items-center gap-1 text-green-600">
            <Image
              src="/icon/Card/Like.png"
              alt="Like Icon"
              width={20}
              height={20}
            />
            {news.upVotes}
          </span>

          <span className="flex items-center gap-1 text-red-600">
            <Image
              src="/icon/Card/dislike.png"
              alt="disLike Icon"
              width={20}
              height={20}
            />
            {news.downVotes}
          </span>

          <span className="flex items-center gap-1 text-gray-600">
            <Image
              src="/icon/Card/comment.png"
              alt="comment Icon"
              width={20}
              height={20}
            />
            {news.comments}
          </span>
        </div>
         <Link href={`/news/${news.id}`}>
        <button
          className=" mt-4 bg-gray-50 border-gray-200 border rounded px-3 py-1 hover:bg-blue-3c83f6 w-full h-10 mx-block
        hover:bg-[#3c83f6] hover:text-white transition-colors duration-300"
        >
          View Details
        </button>
        </Link>
      </div>
    </div>
  );
}
