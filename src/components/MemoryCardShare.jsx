import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { X, Share2, Download } from "lucide-react";

const MemoryCardShare = ({ onClose }) => {
  const cardRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [memory, setMemory] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("myMemory");
    if (saved) {
      setMemory(JSON.parse(saved));
    }
  }, []);

  const dummyMemory = {
  name: "Aisyah Rahman",
  city: "Kuala Lumpur",
  state: "Selangor",
  year: "1992",
  story_title: "My First Tupperware",
  description: "This was my first Tupperware from my mom when I started secondary school. Still using it today!",
  image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  video: null,
};

  const displayMemory = memory || dummyMemory;

  const handleShare = async () => {
    if (!cardRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        const file = new File([blob], "my-tupperware-memory.png", { type: "image/png" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${displayMemory.name}'s Tupperware Memory`,
            text: `${displayMemory.story_title} — ${displayMemory.description}`,
            files: [file],
          });
        } else {
          // Fallback — download
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "my-tupperware-memory.png";
          link.click();
        }
      }, "image/png");
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative">

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-lg font-black text-purple-700 text-center mb-4">
          {memory ? "Your Memory Card" : "Example Memory Card"}
        </h2>

        {/* Memory Card — jo share hoga */}
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden shadow-lg"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
        >
          {/* Image ya Video */}
          {displayMemory.image ? (
            <img
              src={displayMemory.image}
              alt="memory"
              className="w-full h-48 object-cover"
            />
          ) : displayMemory.video ? (
            <video
              src={displayMemory.video}
              className="w-full h-48 object-cover"
              muted
            />
          ) : (
            <div className="w-full h-48 bg-purple-300 flex items-center justify-center">
              <p className="text-white text-4xl">📦</p>
            </div>
          )}

          {/* Card Content */}
          <div className="p-4">
            {/* Tupperware Branding */}
            <div className="flex items-center justify-between mb-3">
              <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                <p className="text-white text-xs font-black">Tupperware® 80 Years</p>
              </div>
              <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-1 rounded-full">
                {displayMemory.year}
              </span>
            </div>

            {/* Name + Location */}
            <p className="text-white font-black text-lg leading-tight">{displayMemory.name}</p>
            <p className="text-pink-200 text-xs mb-2">{displayMemory.city}, {displayMemory.state}</p>

            {/* Story Title */}
            <p className="text-white font-bold text-sm mb-1">{displayMemory.story_title}</p>

            {/* Description */}
            <p className="text-pink-100 text-xs leading-relaxed line-clamp-3">
              "{displayMemory.description}"
            </p>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-white border-opacity-20">
              <p className="text-white text-xs opacity-70 text-center">
                Malaysia's Largest Tupperware Memory Wall
              </p>
            </div>
          </div>
        </div>

        {/* Share + Download Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
          >
            <Share2 size={16} />
            {sharing ? "Sharing..." : "Share"}
          </button>
          <button
            onClick={async () => {
              if (!cardRef.current) return;
              const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
              const url = canvas.toDataURL("image/png");
              const link = document.createElement("a");
              link.href = url;
              link.download = "my-tupperware-memory.png";
              link.click();
            }}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-gray-200"
          >
            <Download size={16} />
          </button>
        </div>

        {!memory && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Submit your memory to see your personalized card!
          </p>
        )}

      </div>
    </div>
  );
};

export default MemoryCardShare;