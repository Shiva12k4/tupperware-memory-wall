import { useState, useEffect } from "react";
import { Users, MapPin, Camera, Video } from "lucide-react";
import API_URL, { fetchWithNgrok } from "../api";

const Header = ({ onShareClick }) => {
  const [stats, setStats] = useState({
    memories: "8,024",
    states: "14",
    photos: "12,540",
    videos: "1,250",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchWithNgrok(`${API_URL}/api/stats`);
        const data = await res.json();
        if (data.success) {
          setStats({
            memories: data.stats.memories,
            states: data.stats.states,
            photos: data.stats.photos,
            videos: data.stats.videos,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">

        {/* Left — Logo */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg">
            80
          </div>
          <div>
            <p className="text-purple-700 font-black text-xl tracking-wide">Tupperware®</p>
            <p className="text-pink-500 font-bold text-sm">80 YEARS FRESH.</p>
            <p className="text-purple-400 text-xs italic">Countless Memories. ♡</p>
          </div>
        </div>

        {/* Center — Title */}
        <div className="text-center flex-1">
          <h1 className="text-3xl font-black text-purple-800 leading-tight">Malaysia's Largest</h1>
          <h2 className="text-3xl font-black text-pink-500">Tupperware Memory Wall</h2>
          <p className="text-gray-500 text-sm mt-1">Every container holds a memory. ♡</p>
        </div>

        {/* Right — Stats */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <Users className="text-pink-400 mx-auto mb-1" size={22} />
            <p className="text-purple-700 font-black text-xl">{stats.memories}</p>
            <p className="text-gray-500 text-xs">Memories Shared</p>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <MapPin className="text-pink-400 mx-auto mb-1" size={22} />
            <p className="text-purple-700 font-black text-xl">{stats.states}</p>
            <p className="text-gray-500 text-xs">States</p>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <Camera className="text-pink-400 mx-auto mb-1" size={22} />
            <p className="text-purple-700 font-black text-xl">{stats.photos}</p>
            <p className="text-gray-500 text-xs">Photos</p>
          </div>
          <div className="w-px h-12 bg-gray-200"></div>
          <div className="text-center">
            <Video className="text-pink-400 mx-auto mb-1" size={22} />
            <p className="text-purple-700 font-black text-xl">{stats.videos}</p>
            <p className="text-gray-500 text-xs">Videos</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;