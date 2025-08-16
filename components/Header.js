import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [stats, setStats] = useState([
  { label: "Total News", value: 0, icon: "/icon/Total-News.png", color: "text-blue-600" },
  { label: "Verified", value: 0, icon: "/icon/Verified.png", color: "text-green-500" },
  { label: "Fake News", value: 0, icon: "/icon/Fake-News.png", color: "text-red-500" },
  { label: "Under Review", value: 0, icon: "/icon/Under-Review.png", color: "text-yellow-500" },
  ]);

  useEffect(() => {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => { 
        const news = data.NewData;

         setStats([
          { label: "Total News", value: news.length, icon: "/icon/Total-News.png", color: "text-blue-600" },
          { label: "Verified", value: news.filter(n => n.stats === "Verified").length, icon: "/icon/Verified.png", color: "text-green-500" },
          { label: "Fake News", value: news.filter(n => n.stats === "Fake News").length, icon: "/icon/Fake-News.png", color: "text-red-500" },
          { label: "Under Review", value: news.filter(n => n.stats === "Under Review").length, icon: "/icon/Under-Review.png", color: "text-yellow-500" },
        ]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <header className="text-center mb-8 p-6 rounded-lg shadow-md bg-gradient-to-r from-blue-200 via-blue-100 to-green-100">
      <h1
        className="text-6xl font-bold mt-4"
        style={{ color: "#3380f2", fontFamily: "Outfit, sans-serif" }}
      >
        Social Anti-Fake News System
      </h1>

      <p
        className="text-gray-600 mt-4 text-lg"
        style={{ color: "#7e7e7eff", fontFamily: "Outfit, sans-serif" }}
      >
        Crowdsourced truth verification through community wisdom and
        collaboration fact-checking
      </p>

      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-lg border border-gray-100 w-54 h-34 flex flex-col items-center justify-center p-4 text-center"
              style={{ color: "#7e7e7eff", fontFamily: "Outfit, sans-serif" }}
            >
              <div className="mb-2">
                <Image src={s.icon} alt={s.label} width={48} height={48} />
              </div>
               <div className={`text-4xl font-semibold ${s.color}`}>{s.value}</div>
              <div className="text-gray-600">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

    </header>
  );
}
