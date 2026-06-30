import { useState, useEffect } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import ShareModal from "./components/ShareModal";
import BottomCTAs from "./components/BottomCTAs";
import MemoryGrid from "./components/MemoryGrid";
import API_URL, { fetchWithNgrok } from "./api";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import CollagePage from "./components/CollagePage";
import { Images, CheckCircle } from "lucide-react";

const App = () => {
  const [activeCategory, setActiveCategory] = useState("All Memories");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const filtered = memories
    .filter((m) => {
      // const matchCategory = activeCategory === "All Memories" || m.category === activeCategory;
      const matchSearch =
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchPeriod = true;
      if (period !== "all") {
        const created = new Date(m.created_at);
        const now = new Date();
        if (period === "today") {
          const today = new Date(); today.setHours(0, 0, 0, 0);
          matchPeriod = created >= today;
        } else if (period === "yesterday") {
          const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0);
          const today = new Date(); today.setHours(0, 0, 0, 0);
          matchPeriod = created >= yesterday && created < today;
        } else if (period === "week") {
          const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
          matchPeriod = created >= weekAgo;
        } else if (period === "month") {
          const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchPeriod = created >= monthAgo;
        }
      }
      return  matchSearch && matchPeriod;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <>
      
      {/* Toast Notification */}
{submitStatus && (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div className={`flex flex-col items-center gap-3 px-8 py-6 rounded-3xl shadow-2xl pointer-events-auto transition-all ${
      submitStatus === "submitting"
        ? "bg-white border border-purple-200"
        : "bg-white border border-green-200"
    }`}>
      {submitStatus === "submitting" ? (
        <>
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          <p className="text-purple-700 font-bold text-base">Submitting your memory...</p>
          <p className="text-gray-400 text-sm">Please wait, uploading files...</p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-500" size={36} />
          </div>
          <p className="text-green-700 font-black text-xl">Memory Submitted!</p>
          <p className="text-gray-400 text-sm text-center">Your memory has been submitted for review.</p>
        </>
      )}
    </div>
  </div>
)}

      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-pink-200 p-4">
              <Header onShareClick={() => setShowModal(true)} />

           {/* Top Banner */}
<div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 sm:py-8 px-4 flex items-center justify-center gap-2 flex-wrap">
  <div className="absolute inset-0 pointer-events-none">
    <div className="animate-shine absolute top-0 h-full w-16 bg-white opacity-20 skew-x-12" />
  </div>

  <div className="flex items-center justify-center gap-2 relative z-10 flex-wrap">
    <span className="font-black text-sm sm:text-2xl animate-pulse whitespace-nowrap">
      + Add your memory
    </span>
    <p className="text-sm sm:text-2xl font-semibold whitespace-nowrap">
      here and win daily prizes with Tupperware.
    </p>
    <button
      onClick={() => setShowModal(true)}
      className="bg-white text-purple-600 font-bold text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full hover:bg-pink-50 whitespace-nowrap"
    >
      Add Now
    </button>
  </div>
</div>
{/* Promo Banner Image */}
<div className="w-full overflow-hidden">
  <img
    src="/evedesk.jpeg"
    alt="Tupperware Promotion"
    className="hidden sm:block w-full object-cover"
  />
  {/* Mobile Banner */}
<img
  src="/evemob.jpeg"
  alt="Tupperware Promotion"
  className="block sm:hidden w-full object-cover"
/>
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
                  onSubmitStart={() => {
                    setShowModal(false);
                    setSubmitStatus("submitting");
                  }}
                  onSubmitSuccess={() => {
                    setSubmitStatus("success");
                    setTimeout(() => setSubmitStatus(null), 3000);
                    fetchMemories();
                  }}
                />
              )}

              <a
                href="/collage"
                className="fixed bottom-6 right-6 z-30 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-4 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce hover:animate-none hover:opacity-90"
              >
                <Images size={18} />
                <span className="text-sm">View Collage</span>
              </a>
            </div>
          }
        />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/collage" element={<CollagePage />} />
      </Routes>
    </>
  );
};

export default App;