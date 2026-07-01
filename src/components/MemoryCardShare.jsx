import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { X, Share2, Download, ChevronLeft, ChevronRight } from "lucide-react";

const dummyMemory = {
  name: "Aisyah Rahman",
  city: "Kuala Lumpur",
  state: "Selangor",
  year: "1992",
  story_title: "My First Tupperware",
  description:
    "This was my first Tupperware from my mom when I started secondary school. Still using it today!",
  image:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  video: null,
};

const MemoryCardShare = ({ onClose }) => {
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [memories, setMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myMemories") || "[]");
    setMemories(saved);
  }, []);

  const displayMemories = memories.length > 0 ? memories : [dummyMemory];
  const current = displayMemories[currentIndex];

  const handleShare = async () => {
    if (!cardRef.current) return;

    setSharing(true);

    try {
      // Wait for all images inside card
      const images = [...cardRef.current.querySelectorAll("img")];

      await Promise.all(
        images.map((img) => {
          if (img.complete && img.naturalWidth !== 0) {
            return Promise.resolve();
          }

          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }),
      );

      // Small delay to ensure browser has painted everything
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(cardRef.current, {
        scale: window.devicePixelRatio || 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#9333ea",
        logging: true,
        imageTimeout: 0,
        removeContainer: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1),
      );

      if (!blob) {
        throw new Error("Canvas blob could not be created.");
      }

      const file = new File([blob], "memory-card.png", {
        type: "image/png",
      });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Memory Card",
          text: `Memory Description: ${current.description}`,
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "memory-card.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Share Error:", error);
    } finally {
      setSharing(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-tupperware-memory.png";
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-black text-purple-700 text-center mb-1">
          {memories.length > 0 ? "Your Memory Cards" : "Example Memory Card"}
        </h2>

        {/* Counter */}
        {displayMemories.length > 1 && (
          <p className="text-xs text-gray-400 text-center mb-4">
            {currentIndex + 1} of {displayMemories.length}
          </p>
        )}

        {/* Navigation + Card */}
        <div className="flex items-center gap-2 mb-4">
          {/* Prev */}
          {displayMemories.length > 1 && (
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center hover:bg-purple-50 disabled:opacity-30"
            >
              <ChevronLeft size={16} className="text-purple-600" />
            </button>
          )}

          {/* Memory Card */}
          <div
            ref={cardRef}
            className="flex-1"
            style={{
              background: "#9333ea",
              overflow: "hidden",
            }}
          >
            {/* Image */}
            {current.image ? (
              <img
                src={current.image}
                alt="memory"
                crossOrigin="anonymous"
                className="w-full h-40 object-cover"
              />
            ) : current.video ? (
              <video
                src={current.video}
                className="w-full h-40 object-cover"
                muted
              />
            ) : (
              <div className="w-full h-40 bg-purple-300 flex items-center justify-center">
                <p className="text-white text-4xl">📦</p>
              </div>
            )}

            {/* Card Content */}
<div style={{ padding: "16px" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
    <div style={{  borderRadius: "999px", padding: "4px 12px" }}>
      <p style={{ color: "white", fontSize: "11px", fontWeight: "bold", margin: 0, whiteSpace: "nowrap" }}>Tupperware® 80 Years</p>
    </div>
    <span style={{  color: "white", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
      {current.year}
    </span>
  </div>

  <p style={{ color: "white", fontWeight: "900", fontSize: "16px", margin: "0 0 4px 0", lineHeight: "1.3" }}>{current.name}</p>
  <p style={{ color: "#f9a8d4", fontSize: "11px", margin: "0 0 8px 0" }}>{current.city}, {current.state}</p>
  <p style={{ color: "white", fontWeight: "700", fontSize: "13px", margin: "0 0 4px 0" }}>{current.story_title}</p>
  {/* <p style={{ color: "#fce7f3", fontSize: "11px", lineHeight: "1.5", margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
    "{current.description}"
  </p> */}

  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
    <p style={{ color: "white", fontSize: "10px", opacity: 0.7, textAlign: "center", margin: 0 }}>
      Malaysia's Largest Tupperware Memory Wall
    </p>
  </div>
</div>
          </div>

          {/* Next */}
          {displayMemories.length > 1 && (
            <button
              onClick={() =>
                setCurrentIndex((i) =>
                  Math.min(displayMemories.length - 1, i + 1),
                )
              }
              disabled={currentIndex === displayMemories.length - 1}
              className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center hover:bg-purple-50 disabled:opacity-30"
            >
              <ChevronRight size={16} className="text-purple-600" />
            </button>
          )}
        </div>

        {/* Dots */}
        {displayMemories.length > 1 && (
          <div className="flex justify-center gap-1.5 mb-4">
            {displayMemories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIndex ? "bg-purple-500 w-4" : "bg-gray-300 w-1.5"
                }`}
              />
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            <Share2 size={16} />
            {sharing ? "Sharing..." : "Share"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-200"
          >
            <Download size={16} />
          </button>
        </div>

        {!memories.length && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Submit your memory to see your personalized card!
          </p>
        )}
      </div>
    </div>
  );
};

export default MemoryCardShare;
