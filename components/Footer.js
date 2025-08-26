// Footer.js
export default function Footer() {
  return (
    <footer className="mt-8 flex justify-between items-center p-4 border-t border-gray-300  ">
      {/* ฝั่งซ้าย */}
      <div>
        <h1
          className="text-6xl font-bold mt-4 text-gray-500 "
        style={{fontFamily: "Outfit, sans-serif" }}
        >
          Check It Off
        </h1>
      </div>

      {/* ฝั่งขวา */}
      <div className="text-right text-gray-500 " style={{ fontFamily: "Outfit, sans-serif" }}>
        <p>Nawapon Somruang 662115027</p>
        <p>8 August 2025</p>
      </div>
    </footer>
  );
}
