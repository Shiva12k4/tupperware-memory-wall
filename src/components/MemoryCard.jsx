import { useState } from "react";
import API_URL, { fetchWithNgrok } from "../api";
import MemoryPopup from "./MemoryPopup";

const MemoryCard = ({ memory }) => {
  const [likes, setLikes] = useState(memory.likes);
  const [liked, setLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Function yahan hoga — return se pehle
  const handleLike = async (e) => {
    e.stopPropagation();
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
      await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/unlike`, { method: "PATCH" });
    } else {
      setLikes(likes + 1);
      setLiked(true);
      await fetchWithNgrok(`${API_URL}/api/memories/${memory.id}/like`, { method: "PATCH" });
    }
  };

  return (
    <>
      <div
        onClick={() => setShowPopup(true)}
        className="bg-pink-50 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      >
        {/* Top — Avatar + Name + Year */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {memory.name?.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-purple-800 leading-tight">{memory.name}</p>
              <p className="text-xs text-blue-800 font-semibold">{memory.city}</p>
            </div>
          </div>
          <span className={`${memory.yearColor || "bg-pink-400"} text-white text-xs font-bold px-2 py-1 rounded-full`}>
            {memory.year}
          </span>
        </div>

        {/* Image */}
        <div className="w-full h-40 overflow-hidden">
          <img
            src={memory.images?.[0] || memory.image_url || memory.image}
            alt={memory.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Caption */}
        <div className="px-3 py-2">
          <p className="text-sm text-blue-800 font-semibold leading-relaxed line-clamp-3">
            "{memory.story_title || memory.caption}"
          </p>
        </div>

        {/* Like Button */}
        <div className="px-3 pb-3 flex items-center justify-end gap-1">
          <button
            onClick={(e) => handleLike(e)}
            className={`flex items-center gap-1 transition-all duration-200 ${liked ? "scale-110" : ""}`}
          >
            <span className="text-lg">{liked ? "❤️" : "🤍"}</span>
            <span className="text-sm font-semibold text-gray-500">{likes}</span>
          </button>
        </div>
      </div>

      {showPopup && (
        <MemoryPopup memory={memory} onClose={() => setShowPopup(false)} />
      )}
    </>
  );
};

export default MemoryCard;