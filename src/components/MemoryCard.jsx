import { useState, useRef } from "react";
import API_URL, { fetchWithNgrok } from "../api";
import MemoryPopup from "./MemoryPopup";
import { Share2, Heart } from "lucide-react";
import html2canvas from "html2canvas";

const MemoryCard = ({ memory }) => {
  const [likes, setLikes] = useState(memory.likes);
  const [liked, setLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const cardRef = useRef(null);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
      await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/unlike`, {
        method: "PATCH",
      });
    } else {
      setLikes(likes + 1);
      setLiked(true);
      await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/like`, {
        method: "PATCH",
      });
    }
  };

 const handleShare = async (e) => {
  e.stopPropagation();
  if (!cardRef.current) return;

  try {
    await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/share`, { method: "PATCH" });

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Clone karo card ko
    const clone = cardRef.current.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.width = cardRef.current.offsetWidth + "px";
    clone.style.borderRadius = "0";
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "null",
      imageTimeout: 0,
      logging: false,
    });

    document.body.removeChild(clone);

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
      <div
        ref={cardRef}
        onClick={() => setShowPopup(true)}
        className="bg-pink-50 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      >
        {/* Top — Avatar + Name + Year */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-s font-bold">
              {memory.name?.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-purple-800 leading-tight">
                {memory.name}
              </p>
              <p className="text-xs text-blue-800 font-semibold">
                {memory.city}
              </p>
            </div>
          </div>
          <span
            className={`${memory.yearColor || "bg-pink-400"} text-white text-xs font-bold px-2 py-1 rounded-full`}
          >
            {memory.year}
          </span>
        </div>

        {/* Image */}
        <div className="w-full h-40 overflow-hidden">
          <img
            src={memory.images?.[0] || memory.image_url || memory.image}
            alt={memory.name}
            loading="lazy"
            crossOrigin="anonymous"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Caption */}
        <div className="px-3 py-2">
          <p className="text-sm text-blue-800 font-semibold leading-relaxed line-clamp-3">
            "{memory.story_title || memory.caption}"
          </p>
        </div>

        {/* Like + Share */}
        <div className="px-3 pb-3 flex items-center justify-between">
          {/* Like — Left */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-all duration-200 ${liked ? "scale-110" : ""}`}
          >
            <Heart
              size={18}
              className={liked ? "text-red-500 fill-red-500" : "text-gray-400"}
            />
            <span className="text-sm font-semibold text-gray-500">{likes}</span>
          </button>

          {/* Share — Right */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-gray-400 hover:text-purple-500 transition-all"
          >
            <Share2 size={16} />
            {/* <span className="text-sm font-semibold text-gray-500">
              {memory.shares || 0}
            </span> */}
          </button>
        </div>
      </div>

     {showPopup && (
  <MemoryPopup
    memory={{...memory, likes: likes}}
    onClose={() => setShowPopup(false)}
  />
)}
    </>
  );
};

export default MemoryCard;
