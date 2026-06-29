import { useState, useEffect } from "react";
import { X, Trophy, Heart, MapPin, Calendar } from "lucide-react";
import API_URL, { fetchWithNgrok } from "../api";

const DailyWinnerModal = ({ onClose }) => {
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const res = await fetchWithNgrok(`${API_URL}/api/admin/memories/winner`);
        const data = await res.json();
        if (data.success) setWinner(data.memory);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWinner();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative">

        {/* Close — overflow se bahar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <X size={16} className="text-gray-600" />
        </button>

        
<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
  {[...Array(40)].map((_, i) => {
    const colors = ["#e879f9", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
    const size = Math.random() * 10 + 5;
    const startX = Math.random() * 100;
    const startY = Math.random() * 100;
    const tx = (Math.random() - 0.5) * 300;
    const ty = (Math.random() - 0.5) * 300;
    const rot = Math.random() * 720;
    return (
      <div
        key={i}
        className="cracker-piece absolute rounded-sm"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${startX}%`,
          top: `${startY}%`,
          background: colors[i % colors.length],
          "--tx": `${tx}px`,
          "--ty": `${ty}px`,
          "--rot": `${rot}deg`,
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${Math.random() * 0.5 + 1.8}s`,
        }}
      />
    );
  })}
</div>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-4 flex items-center gap-3 relative z-10 rounded-t-3xl">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <Trophy className="text-yellow-300" size={22} />
          </div>
          <div>
            <h2 className="text-white font-black text-lg">Today's Winner</h2>
            <p className="text-pink-200 text-xs">Most loved memory of the day</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
            </div>
          ) : !winner ? (
            <div className="text-center py-16 px-6">
              <Trophy className="text-gray-300 mx-auto mb-3" size={48} />
              <p className="text-gray-500 font-semibold">No winner announced yet!</p>
              <p className="text-gray-400 text-sm mt-1">Check back later.</p>
            </div>
          ) : (
            <>
              {/* Image */}
              {winner.images?.[0] && (
                <div className="w-full h-56 overflow-hidden">
                  <img
                    src={winner.images[0]}
                    alt={winner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Details */}
              <div className="p-6 rounded-b-3xl">
                {/* Trophy Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-100 text-yellow-600 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                    <Trophy size={12} /> Winner
                  </span>
                  <span className="bg-purple-100 text-purple-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Heart size={12} /> {winner.likes || 0} Likes
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-purple-800 font-black text-xl mb-1">{winner.name}</h3>

                {/* Location + Year */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={12} className="text-pink-400" /> {winner.city}, {winner.state}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar size={12} className="text-purple-400" /> {winner.year}
                  </span>
                </div>

                {/* Story Title */}
                <p className="text-purple-700 font-bold text-sm mb-2">{winner.story_title}</p>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
                  "{winner.description}"
                </p>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default DailyWinnerModal;