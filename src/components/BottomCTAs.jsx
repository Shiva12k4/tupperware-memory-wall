import { Camera, Sparkles, Trophy, Gift, ArrowRight, ChevronRight } from "lucide-react";
import { useState } from "react";
import MemoryCardShare from "./MemoryCardShare";

const BottomCTAs = ({ onShareClick }) => {
  const [showCard, setShowCard] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
        
        {/* 1 — Share Your Memory */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-5 flex flex-col justify-between min-h-36 shadow-lg">
          <div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Camera className="text-white" size={18} />
            </div>
            <h3 className="text-white font-black text-lg leading-tight">
              Share Your Tupperware Memory
            </h3>
            <p className="text-pink-100 text-xs mt-1">
              Be part of Malaysia's largest memory collection and inspire generations.
            </p>
          </div>
          <button
            onClick={onShareClick}
            className="mt-4 bg-white text-purple-600 font-bold text-sm px-4 py-2 rounded-full hover:bg-pink-50 transition-all w-fit flex items-center gap-1"
          >
            SHARE YOUR MEMORY <ArrowRight size={14} />
          </button>
        </div>

        {/* 2 — AI Memory Card */}
        <div className="bg-pink-50 rounded-2xl p-5 shadow-md flex flex-col justify-between border border-pink-100 relative overflow-hidden min-h-36">
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mb-3">
              <Sparkles className="text-purple-600" size={18} />
            </div>
            <h3 className="text-purple-700 font-black text-lg leading-tight">
              AI Memory Card
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              Your memory. Beautifully turned into a keepsake.
            </p>
          </div>

          {/* Mini Card Stack Visual */}
          <div className="absolute right-3 top-14 w-24">
            <div className="bg-white rounded-lg shadow-md p-2 rotate-6 absolute right-2 top-2 w-20">
              <div className="w-full h-12 bg-pink-200 rounded mb-1"></div>
              <p className="text-[6px] text-gray-400">Aisyah's Memory</p>
              <p className="text-[6px] text-gray-300">1992 · KL</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-2 -rotate-3 relative w-20">
              <div className="w-full h-12 bg-pink-200 rounded mb-1"></div>
              <p className="text-[6px] text-gray-400">Aisyah's Memory</p>
              <p className="text-[6px] text-gray-300">1992 · KL</p>
            </div>
          </div>

          <button
            onClick={() => setShowCard(true)}
            className="mt-3 border-2 border-purple-400 text-purple-600 font-bold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all w-fit relative z-10"
          >
            VIEW EXAMPLE
          </button>
        </div>

        {/* 3 — Featured This Week */}
        <div className="bg-purple-50 rounded-2xl p-5 shadow-md flex flex-col justify-between border border-purple-100 min-h-36">
          <div>
            <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
              <Trophy className="text-yellow-500" size={18} />
            </div>
            <h3 className="text-purple-700 font-black text-lg leading-tight">
              Featured This Week
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              Celebrating the most loved memories of the week.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex -space-x-2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/men/12.jpg" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
            </div>
            <div className="flex items-center gap-1">
              <div>
                <p className="text-xs text-purple-600 font-semibold underline cursor-pointer">View All</p>
                <p className="text-xs text-purple-600 font-semibold underline cursor-pointer">View All Winners</p>
              </div>
              <ChevronRight className="text-purple-400" size={16} />
            </div>
          </div>
        </div>

        {/* 4 — Weekly Challenge */}
        <div className="bg-purple-50 rounded-2xl p-5 shadow-md flex flex-col justify-between border border-purple-100 min-h-36">
          <div>
            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center mb-3">
              <Gift className="text-pink-500" size={18} />
            </div>
            <h3 className="text-purple-700 font-black text-lg leading-tight">
              Weekly Challenge
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              Share your Vintage Treasures memory and stand a chance to win amazing prizes!
            </p>
          </div>
          <button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-all w-fit flex items-center gap-1">
            JOIN CHALLENGE <ChevronRight size={14} />
          </button>
        </div>

      </div>

      {/* Memory Card Share Popup */}
      {showCard && <MemoryCardShare onClose={() => setShowCard(false)} />}
    </>
  );
};

export default BottomCTAs;