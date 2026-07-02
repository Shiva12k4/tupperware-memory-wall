import { useState, useEffect } from "react";
import API_URL, { fetchWithNgrok } from "../api";
import MemoryPopup from "./MemoryPopup";

const CollagePage = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 40;

  const fetchMemories = async (pageNum = 1) => {
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/memories`);
      const data = await res.json();
      if (data.success) {
        const all = data.memories;
        const start = (pageNum - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const slice = all.slice(start, end);
        if (pageNum === 1) setMemories(slice);
        else setMemories(prev => [...prev, ...slice]);
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

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 30%, #fce7f3 60%, #ede9fe 100%)" }}>

      {/* Banner */}
      <div className="relative flex items-center py-4 px-6 overflow-hidden bg-white border-b-2 border-purple-100">
        <a href="/" className="flex-shrink-0 flex items-center gap-1 bg-purple-100 text-purple-600 font-bold text-sm px-3 py-2 rounded-full hover:bg-purple-200 transition-all relative z-10">
          ← Back
        </a>
        <div className="flex-1 text-center relative z-10">
          <h1 className="text-xl sm:text-3xl font-black text-purple-800 drop-shadow-sm">
            Tupperware Memory Wall
          </h1>
          <p className="text-pink-500 text-xs sm:text-sm mt-1 font-semibold">
            Every container holds a memory ♡
          </p>
        </div>
        <div className="flex-shrink-0 w-16" />
      </div>

      {/* Grid */}
      <div className="p-2 sm:p-4">
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
            {/* Instagram Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 sm:gap-2">
              {memories.map((memory, index) => (
                <div
                  key={memory.id}
                  onClick={() => setSelectedIndex(index)}
                  className="cursor-pointer group overflow-hidden rounded-lg sm:rounded-xl bg-white"
                >
                  {memory.images?.[0] ? (
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={memory.images[0]}
                        alt={memory.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Desktop Hover Overlay */}
                      <div className="hidden sm:flex absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                        <p className="text-white font-black text-sm text-center px-2 leading-tight drop-shadow">
                          {memory.name}
                        </p>
                        <p className="text-pink-200 text-xs mt-1 drop-shadow">
                          {memory.city} · {memory.year}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  )}

                  {/* Mobile — Always visible below image */}
                  <div className="sm:hidden px-2 py-1.5 bg-white text-center">
                    <p className="text-purple-800 font-bold text-xs truncate">{memory.name}</p>
                    <p className="text-pink-500 text-xs truncate">{memory.city} · {memory.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-8 mb-4">
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

      {/* Memory Popup with Prev/Next */}
      {selectedIndex !== null && (
        <MemoryPopup
          memory={{
            ...memories[selectedIndex],
            caption: memories[selectedIndex].description,
            yearColor: "bg-pink-400",
          }}
          onClose={() => setSelectedIndex(null)}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null}
          onNext={selectedIndex < memories.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : null}
        />
      )}
    </div>
  );
};

export default CollagePage;