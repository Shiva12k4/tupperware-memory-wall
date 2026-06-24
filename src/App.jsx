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
  const [sortBy, setSortBy] = useState("recent");
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

      // Period filter
      let matchPeriod = true;
      if (period !== "all") {
        const now = new Date();
        const created = new Date(m.created_at);
        if (period === "week") {
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          matchPeriod = created >= weekAgo;
        } else if (period === "month") {
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          matchPeriod = created >= monthAgo;
        }
      }
      return matchCategory && matchSearch && matchPeriod;
    })
    .sort((a, b) => {
      if (sortBy === "liked") return (b.likes || 0) - (a.likes || 0);
      if (sortBy === "shared") return (b.shares || 0) - (a.shares || 0);
      return new Date(b.created_at) - new Date(a.created_at); // recent
    });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-pink-200 p-4">
            {/* Header */}
            <Header onShareClick={() => setShowModal(true)} />

            {/* Main Container */}
            <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-3xl shadow-md mx-2 my-4 overflow-hidden">
              <FilterBar
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
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
