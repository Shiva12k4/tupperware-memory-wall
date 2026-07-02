import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MemoryCard from "./MemoryCard";
import MemoryPopup from "./MemoryPopup";

const MemoryGrid = ({ memories, viewMode }) => {
  const scrollRef = useRef(null);
  const [mobilePage, setMobilePage] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const MOBILE_PER_PAGE = 2;
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

  const totalMobilePages = Math.ceil(memories.length / MOBILE_PER_PAGE);
  const mobileMemories = memories.slice(
    mobilePage * MOBILE_PER_PAGE,
    (mobilePage + 1) * MOBILE_PER_PAGE
  );

  if (memories.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-400 font-semibold">No memories found!</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <>
        <div className="flex flex-col gap-4">
          {memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
        {selectedIndex !== null && (
          <MemoryPopup
            memory={{ ...memories[selectedIndex], caption: memories[selectedIndex].description, yearColor: "bg-pink-400" }}
            onClose={() => setSelectedIndex(null)}
            onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null}
            onNext={selectedIndex < memories.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : null}
          />
        )}
      </>
    );
  }

  const MobileSlider = () => (
    <div className="sm:hidden relative">
      <button
        onClick={() => setMobilePage(p => Math.max(0, p - 1))}
        disabled={mobilePage === 0}
        className="absolute -left-3 top-1/3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30"
      >
        <ChevronLeft className="text-purple-600" size={18} />
      </button>

      <div className="flex flex-col gap-4 px-6">
        {mobileMemories.map((memory, i) => {
          const actualIndex = mobilePage * MOBILE_PER_PAGE + i;
          return (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onClick={() => setSelectedIndex(actualIndex)}
            />
          );
        })}
      </div>

      <button
        onClick={() => setMobilePage(p => Math.min(totalMobilePages - 1, p + 1))}
        disabled={mobilePage === totalMobilePages - 1}
        className="absolute -right-3 top-1/3 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-30"
      >
        <ChevronRight className="text-purple-600" size={18} />
      </button>

      <p className="text-center text-xs text-gray-400 font-semibold mt-3">
        {mobilePage + 1} / {totalMobilePages}
      </p>
    </div>
  );

  if (!needsCarousel) {
    return (
      <>
        <MobileSlider />
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
        {selectedIndex !== null && (
          <MemoryPopup
            memory={{ ...memories[selectedIndex], caption: memories[selectedIndex].description, yearColor: "bg-pink-400" }}
            onClose={() => setSelectedIndex(null)}
            onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null}
            onNext={selectedIndex < memories.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : null}
          />
        )}
      </>
    );
  }

  return (
    <>
      <MobileSlider />

      <div className="relative hidden sm:block">
        <button
          onClick={() => scroll("left")}
          className="hidden lg:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center hover:bg-purple-50 transition-all"
        >
          <ChevronLeft className="text-purple-600" size={20} />
        </button>

        <div
          ref={scrollRef}
          className="no-scrollbar grid sm:grid-cols-2 gap-4 lg:grid-flow-col lg:grid-rows-2 lg:grid-cols-none lg:auto-cols-[19%] lg:overflow-x-auto lg:scroll-smooth"
        >
          {memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center hover:bg-purple-50 transition-all"
        >
          <ChevronRight className="text-purple-600" size={20} />
        </button>
      </div>

      {selectedIndex !== null && (
        <MemoryPopup
          memory={{ ...memories[selectedIndex], caption: memories[selectedIndex].description, yearColor: "bg-pink-400" }}
          onClose={() => setSelectedIndex(null)}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null}
          onNext={selectedIndex < memories.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : null}
        />
      )}
    </>
  );
};

export default MemoryGrid;