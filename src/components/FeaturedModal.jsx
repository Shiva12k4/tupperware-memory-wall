import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Trophy,
  ChevronDown,
} from "lucide-react";
import API_URL, { fetchWithNgrok } from "../api";
import MemoryCard from "./MemoryCard";

const MemorySlider = ({ memories, title, icon }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setCurrentIndex((i) => Math.min(memories.length - 1, i + 1));

  const desktopStart = Math.floor(currentIndex / 5) * 5;
  const desktopVisible = memories.slice(desktopStart, desktopStart + 5);

  if (memories.length === 0)
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="text-base font-black text-purple-700">{title}</h3>
        </div>
        <div className="bg-white rounded-2xl p-8 text-center border border-purple-100">
          <p className="text-gray-400 text-sm">
            No memories found for this period
          </p>
        </div>
      </div>
    );

  const rankColors = [
    "bg-yellow-400",
    "bg-gray-400",
    "bg-orange-400",
    "bg-purple-400",
  ];

  return (
    <div className="mb-8">
      {/* Section Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-base font-black text-purple-700">{title}</h3>
        </div>
        <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
          Top {memories.length}
        </span>
      </div>

      {/* Desktop Slider */}
      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 5))}
          disabled={desktopStart === 0}
          className="w-9 h-9 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-purple-50 disabled:opacity-30 border border-gray-100"
        >
          <ChevronLeft className="text-purple-600" size={18} />
        </button>

        <div className="flex-1 grid grid-cols-5 gap-3">
          {desktopVisible.map((memory, index) => (
            <div key={memory.id} className="relative">
              <div
                className={`absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md ${
                  rankColors[desktopStart + index] || "bg-purple-400"
                }`}
              >
                {desktopStart + index + 1}
              </div>
              <MemoryCard
                memory={{
                  ...memory,
                  yearColor: "bg-pink-400",
                  caption: memory.description,
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(memories.length - 1, i + 5))
          }
          disabled={desktopStart + 5 >= memories.length}
          className="w-9 h-9 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-purple-50 disabled:opacity-30 border border-gray-100"
        >
          <ChevronRight className="text-purple-600" size={18} />
        </button>
      </div>

      {/* Mobile Slider */}
      <div className="flex lg:hidden items-center gap-3">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="w-9 h-9 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-purple-50 disabled:opacity-30 border border-gray-100"
        >
          <ChevronLeft className="text-purple-600" size={18} />
        </button>

        <div className="flex-1 relative">
          <div
            className={`absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md ${
              rankColors[currentIndex] || "bg-purple-400"
            }`}
          >
            {currentIndex + 1}
          </div>
          <MemoryCard
            memory={{
              ...memories[currentIndex],
              yearColor: "bg-pink-400",
              caption: memories[currentIndex]?.description,
            }}
          />
        </div>

        <button
          onClick={next}
          disabled={currentIndex === memories.length - 1}
          className="w-9 h-9 flex-shrink-0 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-purple-50 disabled:opacity-30 border border-gray-100"
        >
          <ChevronRight className="text-purple-600" size={18} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {memories.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex ? "bg-purple-500 w-4" : "bg-gray-300 w-1.5"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const FeaturedModal = ({ onClose }) => {
  const [period, setPeriod] = useState("week");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [likedMemories, setLikedMemories] = useState([]);
  const [sharedMemories, setSharedMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useRef(null);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/memories`);
      const data = await res.json();
      if (data.success) {
        let filtered = data.memories;

        const now = new Date();
        if (period === "today") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filtered = filtered.filter((m) => new Date(m.created_at) >= today);
        } else if (period === "yesterday") {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filtered = filtered.filter((m) => {
            const d = new Date(m.created_at);
            return d >= yesterday && d < today;
          });
        } else if (period === "week") {
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter((m) => new Date(m.created_at) >= weekAgo);
        } else if (period === "month") {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter((m) => new Date(m.created_at) >= monthAgo);
        } else if (period === "custom" && customStart && customEnd) {
          const start = new Date(customStart);
          const end = new Date(customEnd);
          end.setHours(23, 59, 59);
          filtered = filtered.filter((m) => {
            const d = new Date(m.created_at);
            return d >= start && d <= end;
          });
        }

        const liked = [...filtered]
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 10);
        const shared = [...filtered]
          .sort((a, b) => (b.shares || 0) - (a.shares || 0))
          .slice(0, 10);

        setLikedMemories(liked);
        setSharedMemories(shared);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [period, customStart, customEnd]);

  useEffect(() => {
    const handleClick = (e) => {
      if (periodRef.current && !periodRef.current.contains(e.target))
        setPeriodOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const periodLabels = {
    today: "Today",
    yesterday: "Yesterday",
    week: "This Week",
    month: "This Month",
    custom: "Custom",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div
        className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden"
        style={{ height: "90vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-pink-500 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
              <Trophy className="text-yellow-300" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Featured Memories
              </h2>
              <p className="text-pink-200 text-xs">
                Top memories by likes & shares
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Period Dropdown */}
            <div ref={periodRef} className="relative">
              <button
                onClick={() => setPeriodOpen(!periodOpen)}
                className="flex items-center gap-2 bg-white bg-opacity-20 text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                {periodLabels[period] || "Custom"}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${periodOpen ? "rotate-180" : ""}`}
                />
              </button>
              {periodOpen && (
                <div className="absolute top-11 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-40 py-2">
                  {["today", "yesterday", "week", "month", "custom"].map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPeriod(p);
                          setPeriodOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-purple-50 ${
                          period === p
                            ? "text-purple-600 font-bold bg-purple-50"
                            : "text-gray-600"
                        }`}
                      >
                        {p === "today"
                          ? "Today"
                          : p === "yesterday"
                            ? "Yesterday"
                            : p === "week"
                              ? "This Week"
                              : p === "month"
                                ? "This Month"
                                : "Custom Date"}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Custom Date */}
        {period === "custom" && (
          <div className="px-6 py-3 flex items-center gap-3 border-b border-purple-100 flex-shrink-0 bg-white bg-opacity-50 flex-wrap">
            <span className="text-sm text-purple-600 font-semibold">From:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-purple-400 bg-white"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-purple-400 bg-white"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading memories...</p>
              </div>
            </div>
          ) : (
            <>
              <MemorySlider
                memories={likedMemories}
                title="Most Liked"
                icon={<Heart size={16} className="text-red-400 fill-red-400" />}
              />
              <div className="border-t border-purple-100 my-2" />
              <MemorySlider
                memories={sharedMemories}
                title="Most Shared"
                icon={<Share2 size={16} className="text-purple-500" />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedModal;
