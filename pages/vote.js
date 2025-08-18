import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function VotePage() {
  const router = useRouter();
  const { id } = router.query;
  const [news, setNews] = useState(null);
  const [form, setForm] = useState({
    name: "",
    vote: "",
    comment: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch news item
  useEffect(() => {
    if (!id) return;
    async function fetchNews() {
      const res = await fetch("/api/news");
      const data = await res.json();
      const item = data.find((n) => n.id === id || n.id === parseInt(id));
      setNews(item);
    }
    fetchNews();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.vote || !form.comment) {
      return alert("Please fill in all required fields");
    }

    try {
      setLoading(true);
      const rowIndex = news.id; // use id as index
      await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rowIndex,
          type: form.vote === "real" ? "up" : "down",
        }),
      });

      alert("Your vote and comment have been submitted!");
      router.back();
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!news) return <p className="p-8">Loading...</p>;

  return (
    <div
      className="p-8 max-w-4xl mx-auto"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      {/* Back button */}
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

      <div className="bg-white rounded-lg w-full max-w-4xl h-[600px] p-0 space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
          {/* Left side: News details */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4 border border-gray-200">
            <h1 className="text-3xl font-bold">{news.title}</h1>

            <div className="flex justify-center mb-4">
              <span
                className={`inline-block px-2 py-1 rounded text-md whitespace-nowrap ${
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

            <p className="text-gray-700">{news.description}</p>
            <p className="text-gray-500">
              By {news.author} • {news.date}
            </p>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1 text-green-600">
                <Image
                  src="/icon/Card/Like.png"
                  alt="Upvote"
                  width={20}
                  height={20}
                />
                {news.upVotes} Real
              </span>
              <span className="flex items-center gap-1 text-red-600">
                <Image
                  src="/icon/Card/Dislike.png"
                  alt="Downvote"
                  width={20}
                  height={20}
                />
                {news.downVotes} Fake
              </span>
            </div>
          </div>

          {/* Right side: Vote form */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Cast Your Vote</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Your Vote</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, vote: "real" }))
                    }
                    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded transition-colors duration-300
                    ${
                      form.vote === "real"
                        ? "bg-green-700 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    <Image
                      src="/icon/Card/Like.png"
                      alt="Upvote"
                      width={25}
                      height={25}
                      className={`${
                        form.vote === "real"
                          ? "filter brightness-0 invert" // เปลี่ยนเป็นขาว
                          : "filter brightness-0 invert-[0.25]" // เปลี่ยนสีอื่น
                      }`}
                    />

                    <span>This is Real</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, vote: "fake" }))
                    }
                    className={`flex-1 flex items-center gap-2 px-4 py-2 rounded transition-colors duration-300
                    ${
                      form.vote === "fake"
                        ? "bg-red-700 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-red-100 hover:text-red-700"
                    }`}
                  >
                    <Image
                      src="/icon/Card/Dislike.png"
                      alt="Downvote"
                      width={25}
                      height={25}
                      className={`${
                        form.vote === "fake"
                          ? "filter brightness-0 invert" // เปลี่ยนเป็นขาว
                          : "filter brightness-0 invert-[0.25]" // เปลี่ยนสีอื่น
                      }`}
                    />
                    <span>This is Fake</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold">
                  Your Comment *
                </label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 border-gray-300"
                  placeholder="Explain why you think this news is real or fake..."
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">
                  Supporting Image URL (optional)
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 border-gray-300"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500">
                  Add a link to an image that supports your argument
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Submit Vote & Comment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
