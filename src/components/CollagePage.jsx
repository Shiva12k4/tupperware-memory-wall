import { useState, useEffect } from "react";
import { X } from "lucide-react";
import API_URL, { fetchWithNgrok } from "../api";
import MemoryPopup from "./MemoryPopup";

const PolaroidCard = ({ memory, onClick }) => {
  const rotations = [-6, -4, -2, 0, 2, 4, 6, -3, 3, -5, 5, 1, -1];
  const rotation = rotations[memory.id % rotations.length];

  return (
    <div
      onClick={() => onClick(memory)}
      className="cursor-pointer inline-block"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: "transform 0.2s",
      }}
      onMouseEnter={e => e.currentTarget.style.transform = `rotate(0deg) scale(1.05)`}
      onMouseLeave={e => e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`}
    >
      {/* Clip */}
      <div className="flex justify-center -mb-1 relative z-10">
        <div className="w-4 h-6 bg-yellow-500 rounded-sm shadow-md" style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%)" }} />
      </div>

      {/* Polaroid */}
      <div className="bg-white shadow-lg p-1.5 pb-6" style={{ width: "90px" }}>
        {memory.images?.[0] ? (
          <img
            src={memory.images[0]}
            alt={memory.name}
            className="w-full object-cover"
            style={{ height: "75px" }}
          />
        ) : (
          <div className="w-full bg-purple-200 flex items-center justify-center" style={{ height: "75px" }}>
            <span className="text-2xl">📦</span>
          </div>
        )}
        <p className="text-center text-gray-600 mt-1 truncate" style={{ fontSize: "8px" }}>
          {memory.name}
        </p>
      </div>
    </div>
  );
};

const StringRow = ({ memories, onClick }) => {
  return (
    <div className="relative mb-8">
      {/* String/Rope */}
      <div
        className="absolute w-full"
        style={{
          top: "12px",
          height: "3px",
          background: "linear-gradient(90deg, #8B4513, #A0522D, #8B4513, #A0522D)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          zIndex: 0,
        }}
      />

      {/* Polaroids */}
      <div className="flex justify-around items-start pt-2 flex-wrap gap-1 px-4">
        {memories.map((memory) => (
          <PolaroidCard key={memory.id} memory={memory} onClick={onClick} />
        ))}
      </div>
    </div>
  );
};

const CollagePage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 40;
  const ITEMS_PER_ROW = 8;

  const fetchMemories = async (pageNum = 1) => {
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/memories`);
      const data = await res.json();
      if (data.success) {
        const all = data.memories;
        const start = (pageNum - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const slice = all.slice(start, end);
        if (pageNum === 1) {
          setMemories(slice);
        } else {
          setMemories(prev => [...prev, ...slice]);
        }
        setHasMore(end < all.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories(1);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMemories(nextPage);
  };

  // Split into rows of 8
  const rows = [];
  for (let i = 0; i < memories.length; i += ITEMS_PER_ROW) {
    rows.push(memories.slice(i, i + ITEMS_PER_ROW));
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 50%, #E0F0FF 100%)" }}>

      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center py-2 px-4 flex items-center justify-center gap-2">
        <div className="absolute inset-0 pointer-events-none">
          <div className="animate-shine absolute top-0 h-full w-16 bg-white opacity-20 skew-x-12" />
        </div>
        <span className="text-lg font-black relative z-10">+</span>
        <p className="text-sm font-semibold relative z-10">
          Add your memory here and win daily prizes with Tupperware.
        </p>
      </div>

      {/* Header */}
      <div className="text-center py-6 px-4">
        <h1 className="text-3xl sm:text-4xl font-black text-purple-800 drop-shadow-sm">
          Malaysia's Memory Wall
        </h1>
        <p className="text-purple-600 text-sm mt-1">Every container holds a memory ♡</p>
      </div>

      {/* Collage */}
      <div className="px-4 pb-12">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-purple-700 font-semibold">Loading memories...</p>
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-purple-700 font-semibold">No memories yet!</p>
          </div>
        ) : (
          <>
            {rows.map((row, i) => (
              <StringRow key={i} memories={row} onClick={setSelectedMemory} />
            ))}

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-8 py-3 rounded-full hover:opacity-90 shadow-lg"
                >
                  Load More Memories
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Memory Popup */}
      {selectedMemory && (
        <MemoryPopup
          memory={{
            ...selectedMemory,
            caption: selectedMemory.description,
            yearColor: "bg-pink-400",
          }}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </div>
  );
};

export default CollagePage;