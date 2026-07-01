import {
  Camera,
  Sparkles,
  Trophy,
  Gift,
  ArrowRight,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import MemoryCardShare from "./MemoryCardShare";
import FeaturedModal from "./FeaturedModal";
import DailyWinnerModal from "./DailyWinnerModal";

const BottomCTAs = ({ onShareClick }) => {
  const [showCard, setShowCard] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showWinner, setShowWinner] = useState(false);

  return (
    <>
 {/* Shop Now — Desktop full width, Mobile grid card */}
<div className="hidden lg:block mx-6 mb-0">
  <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-5 shadow-lg flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <ShoppingBag className="text-white" size={18} />
      </div>
      <div>
        <h3 className="text-white font-black text-lg leading-tight">Shop Tupperware at Exclusive Prices!</h3>
        <p className="text-pink-100 text-xs mt-1">Grab amazing deals today</p>
      </div>
    </div>
    <a
      href="https://shop.tupperwarebrands.com.my/collections/monthly-offers"
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 bg-white text-purple-600 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-pink-50 transition-all ml-4 flex items-center gap-1"
      style={{ animation: "shopPulse 1.5s ease-in-out infinite" }}
    >
      SHOP NOW <ArrowRight size={14} />
    </a>
  </div>
</div>

{/* Grid — 4 cards desktop, Shop Now card mobile mein */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 ">

  {/* Shop Now — Sirf Mobile */}
  <div className="lg:hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-2xl p-5 shadow-lg flex flex-col justify-between min-h-36">
    <div>
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mb-3">
        <ShoppingBag className="text-white" size={18} />
      </div>
      <h3 className="text-white font-black text-lg leading-tight">Shop Tupperware at Exclusive Prices!</h3>
      <p className="text-pink-100 text-xs mt-1">Grab amazing deals today</p>
    </div>
    <a
      href="https://shop.tupperwarebrands.com.my/collections/monthly-offers"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 bg-white text-purple-600 font-bold text-sm px-4 py-2 rounded-full hover:bg-pink-50 transition-all w-fit flex items-center gap-1"
      style={{ animation: "shopPulse 1.5s ease-in-out infinite" }}
    >
      SHOP NOW <ArrowRight size={14} />
    </a>
  </div>
</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-6">
  
         {/* 4 — Daily Winner */}
<div className="bg-yellow-50 rounded-2xl p-5 shadow-md flex flex-col justify-between border border-yellow-100 min-h-36">
  <div>
    <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
      <Trophy className="text-yellow-500" size={18} />
    </div>
    <h3 className="text-purple-700 font-black text-lg leading-tight">
      Daily Winner
    </h3>
    <p className="text-gray-500 text-xs mt-1">
      Today's most loved Tupperware memory!
    </p>
  </div>
  <button
    onClick={() => setShowWinner(true)}
    className="mt-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-all w-fit flex items-center gap-1"
  >
    View Winner <ChevronRight size={14} />
  </button>
</div>
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
              Be part of Malaysia's largest memory collection and inspire
              generations.
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
            SEE YOUR MEMORY
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
          <div className="flex items-center justify-between mt-3">
            <div className="flex -space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://randomuser.me/api/portraits/men/12.jpg"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            </div>
            <button
              onClick={() => setShowFeatured(true)}
              className="flex items-center gap-1 text-xs text-purple-600 font-bold underline cursor-pointer hover:text-purple-800"
            >
              View All <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 4 — Weekly Challenge */}
        {/* <div className="bg-purple-50 rounded-2xl p-5 shadow-md flex flex-col justify-between border border-purple-100 min-h-36">
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
        </div> */}

       
      </div>

      {/* Memory Card Share Popup */}
      {showCard && <MemoryCardShare onClose={() => setShowCard(false)} />}
      {showFeatured && <FeaturedModal onClose={() => setShowFeatured(false)} />}
        {showWinner && <DailyWinnerModal onClose={() => setShowWinner(false)} />}
    </>
  );
};

export default BottomCTAs;
