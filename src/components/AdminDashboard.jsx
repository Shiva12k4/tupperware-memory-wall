import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, LogOut, Users, Hourglass, ThumbsUp } from "lucide-react";
import API_URL, { fetchWithNgrok } from "../api";

const ADMIN_PASSWORD = "tupperware2024";

const ViewPopup = ({ memory, onClose, onApprove, onReject, isApproved }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">✕</button>

        <h2 className="text-xl font-black text-purple-700 mb-4">Memory Details</h2>

        {memory.images && memory.images.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {memory.images.map((img, i) => (
              <img key={i} src={img} alt={`img-${i}`} className="w-32 h-32 object-cover rounded-xl" />
            ))}
          </div>
        )}

        {memory.videos && memory.videos.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {memory.videos.map((vid, i) => (
              <video key={i} src={vid} controls className="w-48 h-32 rounded-xl object-cover" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Name</p>
            <p className="text-sm font-semibold text-gray-700">{memory.name}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Email</p>
            <p className="text-sm font-semibold text-gray-700">{memory.email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Mobile</p>
            <p className="text-sm font-semibold text-gray-700">+60 {memory.mobile}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Location</p>
            <p className="text-sm font-semibold text-gray-700">{memory.city}, {memory.state}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Category</p>
            <p className="text-sm font-semibold text-gray-700">{memory.category}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400">Year</p>
            <p className="text-sm font-semibold text-gray-700">{memory.year || "N/A"}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-400">Story Title</p>
          <p className="text-sm font-semibold text-gray-700">{memory.story_title}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-400">Description</p>
          <p className="text-sm text-gray-700">{memory.description}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-400 mb-2">Consents</p>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-600">{memory.terms_accepted ? "✅" : "❌"} Terms & Conditions</p>
            <p className="text-xs text-gray-600">{memory.marketing_consent ? "✅" : "❌"} Marketing Consent</p>
            <p className="text-xs text-gray-600">{memory.content_consent ? "✅" : "❌"} Content Usage Consent</p>
          </div>
        </div>

        {!isApproved && (
          <div className="flex gap-3">
            <button
              onClick={() => { onApprove(memory.id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600"
            >
              <CheckCircle size={16} /> Approve
            </button>
            <button
              onClick={() => { onReject(memory.id); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600"
            >
              <XCircle size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/admin/memories/pending`);
      const data = await res.json();
      if (data.success) setMemories(data.memories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApproved = async () => {
    setLoading(true);
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/admin/memories/approved`);
      const data = await res.json();
      if (data.success) setMemories(data.memories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/memories/pending`),
        fetch(`${API_URL}/api/admin/memories/approved`),
      ]);
      const pendingData = await pendingRes.json();
      const approvedData = await approvedRes.json();
      const p = pendingData.memories?.length || 0;
      const a = approvedData.memories?.length || 0;
      setStats({ total: p + a, pending: p, approved: a });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchPending();
      fetchStats();
    }
  }, [isLoggedIn]);

  const handleApprove = async (id) => {
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/approve`, { method: "PATCH" });
      setMemories(memories.filter((m) => m.id !== id));
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/reject`, { method: "PATCH" });
      setMemories(memories.filter((m) => m.id !== id));
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "pending") fetchPending();
    else fetchApproved();
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg mx-auto mb-4">
              80
            </div>
            <h1 className="text-2xl font-black text-purple-700">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Tupperware Memory Wall</p>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (password === ADMIN_PASSWORD ? setIsLoggedIn(true) : alert("Wrong password!"))}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
            />
            <button
              onClick={() => password === ADMIN_PASSWORD ? setIsLoggedIn(true) : alert("Wrong password!")}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
            >
              Login →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-500 px-8 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-black text-lg">
            80
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Admin Dashboard</h1>
            <p className="text-pink-200 text-xs">Tupperware Memory Wall</p>
          </div>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-2 bg-white bg-opacity-20 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-opacity-30 transition-all"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-gray-100">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Users className="text-purple-600" size={22} />
          </div>
          <div>
            <p className="text-2xl font-black text-purple-700">{stats.total}</p>
            <p className="text-xs text-gray-400 font-semibold">Total Submissions</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-yellow-100">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <Hourglass className="text-yellow-500" size={22} />
          </div>
          <div>
            <p className="text-2xl font-black text-yellow-500">{stats.pending}</p>
            <p className="text-xs text-gray-400 font-semibold">Pending Approval</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 border border-green-100">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <ThumbsUp className="text-green-500" size={22} />
          </div>
          <div>
            <p className="text-2xl font-black text-green-500">{stats.approved}</p>
            <p className="text-xs text-gray-400 font-semibold">Approved Memories</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 flex gap-3 mb-4">
        <button
          onClick={() => handleTabChange("pending")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
            activeTab === "pending"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
              : "bg-white text-gray-500 hover:bg-purple-50 border border-gray-200"
          }`}
        >
          <Clock size={15} />
          Pending
          {stats.pending > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "pending" ? "bg-white text-purple-600" : "bg-pink-500 text-white"}`}>
              {stats.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => handleTabChange("approved")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
            activeTab === "approved"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
              : "bg-white text-gray-500 hover:bg-purple-50 border border-gray-200"
          }`}
        >
          <CheckCircle size={15} />
          Approved
        </button>
      </div>

      {/* Table */}
      <div className="px-8 pb-8">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">⏳</p>
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-4xl mb-3">{activeTab === "pending" ? "✅" : "📭"}</p>
            <p className="text-gray-400 font-semibold">
              {activeTab === "pending" ? "No pending submissions!" : "No approved memories yet!"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 text-xs font-black text-purple-600 uppercase tracking-wide">
              <div className="col-span-2">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Mobile</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Rows */}
            {memories.map((memory, index) => (
              <div
                key={memory.id}
                className={`grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm border-b border-gray-50 hover:bg-purple-50 transition-all ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                {/* Name with Avatar */}
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {memory.name?.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-700 truncate">{memory.name}</span>
                </div>

                <div className="col-span-3 text-gray-500 truncate">{memory.email}</div>
                <div className="col-span-2 text-gray-500 truncate">+60 {memory.mobile}</div>
                <div className="col-span-2 text-gray-500 truncate">{memory.city}, {memory.state}</div>

                <div className="col-span-2">
                  <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                    {memory.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(memory.id)}
                        className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                        title="Approve"
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        onClick={() => handleReject(memory.id)}
                        className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        title="Reject"
                      >
                        <XCircle size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedMemory(memory)}
                    className="p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
                    title="View"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Popup */}
      {selectedMemory && (
        <ViewPopup
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          isApproved={activeTab === "approved"}
        />
      )}
    </div>
  );
};

export default AdminDashboard;