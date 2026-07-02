import { useState, useRef } from "react";
import API_URL, { fetchWithNgrok } from "../api";
import { Share2, Heart } from "lucide-react";
import html2canvas from "html2canvas";

const MemoryCard = ({ memory, onClick }) => {
  const [likes, setLikes] = useState(memory.likes);
  const [liked, setLiked] = useState(() => {
    const likedIds = JSON.parse(localStorage.getItem("likedMemories") || "[]");
    return likedIds.includes(memory.id);
  });
  const shareCardRef = useRef(null);

  const handleLike = async (e) => {
    e.stopPropagation();
    const likedIds = JSON.parse(localStorage.getItem("likedMemories") || "[]");
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
      localStorage.setItem("likedMemories", JSON.stringify(likedIds.filter(id => id !== memory.id)));
      await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/unlike`, { method: "PATCH" });
    } else {
      setLikes(likes + 1);
      setLiked(true);
      localStorage.setItem("likedMemories", JSON.stringify([...likedIds, memory.id]));
      await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/like`, { method: "PATCH" });
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (!shareCardRef.current) return;

    try {
      await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/share`, { method: "PATCH" });

      const imgs = [...shareCardRef.current.querySelectorAll("img")];
      await Promise.all(
        imgs.map((img) => {
          if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(shareCardRef.current, {
        scale: window.devicePixelRatio || 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#9333ea",
        logging: false,
        imageTimeout: 0,
        removeContainer: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1)
      );

      if (!blob) throw new Error("Failed to create image.");

      const file = new File([blob], "tupperware-memory.png", { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: memory.story_title || memory.name,
          text: memory.description || memory.caption,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: memory.story_title || memory.name,
          text: memory.description || memory.caption,
          url: window.location.href,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tupperware-memory.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Share Error:", err);
    }
  };

  return (
    <>
      {/* Visible Card */}
      <div
        onClick={onClick}
        className="bg-pink-50 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      >
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-s font-bold flex-shrink-0">
              {memory.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-purple-800 leading-tight truncate">{memory.name}</p>
              <p className="text-xs text-blue-800 font-semibold truncate">{memory.city}</p>
            </div>
          </div>
          <span className={`${memory.yearColor || "bg-pink-400"} text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ml-2`}>
            {memory.year}
          </span>
        </div>

        <div className="w-full h-40 overflow-hidden">
          <img
            src={memory.images?.[0] || memory.image_url || memory.image}
            alt={memory.name}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="px-3 py-2">
          <p className="text-sm text-blue-800 font-semibold leading-relaxed line-clamp-3">
            "{memory.story_title || memory.caption}"
          </p>
        </div>

        <div className="px-3 pb-3 flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-all duration-200 ${liked ? "scale-110" : ""}`}
          >
            <Heart size={18} className={liked ? "text-red-500 fill-red-500" : "text-gray-400"} />
            <span className="text-sm font-semibold text-gray-500">{likes}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-gray-400 hover:text-purple-500 transition-all"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Hidden Share Card */}
      <div
        ref={shareCardRef}
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          width: "300px",
          background: "#9333ea",
          overflow: "hidden",
        }}
      >
        {(memory.images?.[0] || memory.image_url || memory.image) ? (
          <img
            src={memory.images?.[0] || memory.image_url || memory.image}
            alt={memory.name}
            crossOrigin="anonymous"
            style={{ width: "100%", height: "160px", objectFit: "cover" }}
          />
        ) : (
          <div style={{ width: "100%", height: "160px", background: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "40px" }}>📦</span>
          </div>
        )}
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ borderRadius: "999px", padding: "4px 12px" }}>
              <p style={{ color: "white", fontSize: "11px", fontWeight: "bold", margin: 0, whiteSpace: "nowrap" }}>Tupperware® 80 Years</p>
            </div>
            <span style={{ color: "white", fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "999px", whiteSpace: "nowrap" }}>
              {memory.year}
            </span>
          </div>
          <p style={{ color: "white", fontWeight: "900", fontSize: "16px", margin: "0 0 4px 0", lineHeight: "1.3" }}>{memory.name}</p>
          <p style={{ color: "#f9a8d4", fontSize: "11px", margin: "0 0 8px 0" }}>{memory.city}, {memory.state}</p>
          <p style={{ color: "white", fontWeight: "700", fontSize: "13px", margin: "0 0 4px 0" }}>{memory.story_title}</p>
          <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <p style={{ color: "white", fontSize: "10px", opacity: 0.7, textAlign: "center", margin: 0 }}>
              Malaysia's Largest Tupperware Memory Wall
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemoryCard;