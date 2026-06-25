import { useState, useEffect } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import MemoryCard from "./components/MemoryCard";
import ShareModal from "./components/ShareModal";
import BottomCTAs from "./components/BottomCTAs";
import MemoryGrid from "./components/MemoryGrid";
import API_URL, { fetchWithNgrok } from "./api";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";


const App = () => {
  const [activeCategory, setActiveCategory] = useState("All Memories");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  // Fetch approved memories from backend
  const fetchMemories = async () => {
    try {
      const response = await fetchWithNgrok(`${API_URL}/api/memories`);
      const data = await response.json();
      if (data.success) {
        const mapped = data.memories.map((m) => ({
          ...m,
          caption: m.description,
          yearColor: "bg-pink-400",
        }));
        setMemories(mapped);
      }
    } catch (err) {
      console.error("Error fetching memories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // Filter memories
  const filtered = memories
    .filter((m) => {
      const matchCategory =
        activeCategory === "All Memories" || m.category === activeCategory;
      const matchSearch =
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchPeriod = true;
      if (period !== "all") {
        const created = new Date(m.created_at);
        const now = new Date();

        if (period === "today") {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          matchPeriod = created >= today;
        } else if (period === "yesterday") {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          matchPeriod = created >= yesterday && created < today;
        } else if (period === "week") {
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          matchPeriod = created >= weekAgo;
        } else if (period === "month") {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchPeriod = created >= monthAgo;
        }
      }
      return matchCategory && matchSearch && matchPeriod;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-pink-200 p-4">
            {/* Header */}
            <Header onShareClick={() => setShowModal(true)} />

            {/* Top Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center py-2 px-4 flex items-center justify-center gap-2">
              {/* Animated shine line */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="animate-shine absolute top-0 h-full w-16 bg-white opacity-20 skew-x-12" />
              </div>

              <span className="text-lg font-black relative z-10">+</span>
              <p className="text-sm font-semibold relative z-10">
                Add your memory here and win daily prizes with Tupperware.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="ml-2 bg-white text-purple-600 font-bold text-xs px-3 py-1 rounded-full hover:bg-pink-50 relative z-10"
              >
                Add Now
              </button>
            </div>

            {/* Main Container */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-3xl shadow-md mx-2 my-4 overflow-hidden">
              <FilterBar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                period={period}
                setPeriod={setPeriod}
              />
              <div className="px-6 py-6">
                {loading ? (
                  <div className="text-center py-20">
                    <p className="text-4xl mb-3">⏳</p>
                    <p className="text-gray-400 font-semibold">
                      Loading memories...
                    </p>
                  </div>
                ) : (
                  <MemoryGrid memories={filtered} viewMode={viewMode} />
                )}
              </div>
              <BottomCTAs onShareClick={() => setShowModal(true)} />
            </div>

            {showModal && (
              <ShareModal
                onClose={() => {
                  setShowModal(false);
                  fetchMemories();
                }}
              />
            )}
          </div>
        }
      />

      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
