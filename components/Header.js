// components/Header.js
export default function Header() {
  return (
    <header className="text-center mb-8 bg-blue-100 p-6">
      {/* ชื่อโปรเจค */}
      <h1 className="text-3xl font-bold text-blue-600">
        Social Anti-Fake News System
      </h1>

      {/* คำอธิบาย */}
      <p className="text-gray-600 mt-2">
        Crowdsourced truth verification through community wisdom and collaborative fact-checking
      </p>
    </header>
  );
}
