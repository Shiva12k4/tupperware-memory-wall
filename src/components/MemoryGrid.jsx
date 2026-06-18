import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MemoryCard from "./MemoryCard";

const MemoryGrid = ({ memories, viewMode }) => {
  const scrollRef = useRef(null);
  const needsCarousel = memories.length > 10;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "right" ? amount : -amount,
        behavior: "smooth",
      });
    }
  };

  if (memories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-400 font-semibold">No memories found!</p>
      </div>
    );
  }

  // List view — simple vertical stack
  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-4">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    );
  }

  // 10 ya kam cards — normal responsive grid, no carousel
  if (!needsCarousel) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>
    );
  }

  // 10 se zyada cards — carousel with arrows
  return (
    <div className="relative">
      {/* Left Arrow — Desktop only */}
      <button
        onClick={() => scroll("left")}
        className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center hover:bg-purple-50 transition-all"
      >
        <ChevronLeft className="text-purple-600" size={20} />
      </button>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        className="no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-flow-col lg:grid-rows-2 lg:grid-cols-none lg:auto-cols-[19%] lg:overflow-x-auto lg:scroll-smooth"
      >
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>

      {/* Right Arrow — Desktop only */}
      <button
        onClick={() => scroll("right")}
        className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center hover:bg-purple-50 transition-all"
      >
        <ChevronRight className="text-purple-600" size={20} />
      </button>
    </div>
  );
};

export default MemoryGrid;