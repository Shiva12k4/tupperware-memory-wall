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
  const filtered = memories.filter((m) => {
    const matchCategory =
      activeCategory === "All Memories" || m.category === activeCategory;
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

 return (
  <Routes>
    <Route path="/" element={
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
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <div className="px-6 py-6">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-3">⏳</p>
                <p className="text-gray-400 font-semibold">Loading memories...</p>
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
    } />

    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
);
};

export default App;