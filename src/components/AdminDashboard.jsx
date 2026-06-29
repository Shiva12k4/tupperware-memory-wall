import { useState, useEffect, useRef } from "react";
import {
  CheckCircle, XCircle, Clock, Eye, LogOut, Users, Hourglass, ThumbsUp,
  Trash2, RotateCcw, ChevronRight, ChevronDown, Download, Heart, Share2, Trophy,
} from "lucide-react";
import API_URL, { fetchWithNgrok } from "../api";

const ADMIN_PASSWORD = "tupperware2024";

const TextExpandable = ({ text, maxLength = 30 }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return <span className="text-gray-400">-</span>;
  if (text.length <= maxLength) return <span>{text}</span>;
  return (
    <span>
      {expanded ? text : `${text.substring(0, maxLength)}...`}
      <button onClick={() => setExpanded(!expanded)} className="text-purple-500 hover:text-purple-700 ml-1">
        {expanded ? "less" : <ChevronRight size={14} className="inline" />}
      </button>
    </span>
  );
};

const ViewPopup = ({ memory, onClose, onApprove, onReject, onDelete, onMoveToPending, isApproved, activeTab }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">✕</button>
        <h2 className="text-xl font-black text-purple-700 mb-4">Memory Details</h2>
        {memory.images && memory.images.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {memory.images.map((img, i) => <img key={i} src={img} alt={`img-${i}`} className="w-32 h-32 object-cover rounded-xl" />)}
          </div>
        )}
        {memory.videos && memory.videos.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {memory.videos.map((vid, i) => <video key={i} src={vid} controls className="w-48 h-32 rounded-xl object-cover" />)}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[["Name", memory.name], ["Email", memory.email], ["Mobile", `+60 ${memory.mobile}`], ["Location", `${memory.city}, ${memory.state}`], ["Category", memory.category], ["Year", memory.year || "N/A"]].map(([label, value]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-semibold text-gray-700">{value}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-400">Story Title</p>
          <p className="text-sm font-semibold text-gray-700">{memory.story_title}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-400">Description</p>
          <p className="text-sm text-gray-700">{memory.description}</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {activeTab === "pending" && (
            <>
              <button onClick={() => { onApprove(memory.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600"><CheckCircle size={16} /> Approve</button>
              <button onClick={() => { onReject(memory.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600"><XCircle size={16} /> Reject</button>
            </>
          )}
          {activeTab === "approved" && (
            <>
              <button onClick={() => { onMoveToPending(memory.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-600"><RotateCcw size={16} /> Move to Pending</button>
              <button onClick={() => { onDelete(memory.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600"><Trash2 size={16} /> Delete</button>
            </>
          )}
          {activeTab === "rejected" && (
            <>
              <button onClick={() => { onMoveToPending(memory.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-600"><RotateCcw size={16} /> Move to Pending</button>
              <button onClick={() => { onApprove(memory.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600"><CheckCircle size={16} /> Move to Approved</button>
              <button onClick={() => { onDelete(memory.id); onClose(); }} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600"><Trash2 size={16} /> Permanent Delete</button>
            </>
          )}
        </div>
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
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [selectedIds, setSelectedIds] = useState([]);
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [approvedTimePeriod, setApprovedTimePeriod] = useState("week");
  const [timeFilterOpen, setTimeFilterOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [approvedDateFilter, setApprovedDateFilter] = useState("all");
  const [approvedDateFilterOpen, setApprovedDateFilterOpen] = useState(false);
  const timeFilterRef = useRef(null);
  const approvedDateRef = useRef(null);

  const timePeriodLabels = {
    today: "Today", yesterday: "Yesterday", week: "This Week", month: "This Month", custom: "Custom",
  };

  const datePeriodLabels = {
    all: "All Time", today: "Today", yesterday: "Yesterday", week: "This Week", month: "This Month",
  };

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/admin/memories/pending`);
      const data = await res.json();
      if (data.success) setMemories(data.memories);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchApproved = async () => {
    setLoading(true);
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/admin/memories/approved`);
      const data = await res.json();
      if (data.success) setMemories(data.memories);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchRejected = async () => {
    setLoading(true);
    try {
      const res = await fetchWithNgrok(`${API_URL}/api/admin/memories/rejected`);
      const data = await res.json();
      if (data.success) setMemories(data.memories);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const [p, a, r] = await Promise.all([
        fetchWithNgrok(`${API_URL}/api/admin/memories/pending`).then(r => r.json()),
        fetchWithNgrok(`${API_URL}/api/admin/memories/approved`).then(r => r.json()),
        fetchWithNgrok(`${API_URL}/api/admin/memories/rejected`).then(r => r.json()),
      ]);
      setStats({
        total: (p.memories?.length || 0) + (a.memories?.length || 0) + (r.memories?.length || 0),
        pending: p.memories?.length || 0,
        approved: a.memories?.length || 0,
        rejected: r.memories?.length || 0,
      });
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (isLoggedIn) { fetchPending(); fetchStats(); }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClick = (e) => {
      if (timeFilterRef.current && !timeFilterRef.current.contains(e.target)) setTimeFilterOpen(false);
      if (approvedDateRef.current && !approvedDateRef.current.contains(e.target)) setApprovedDateFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleApprove = async (id) => {
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/approve`, { method: "PATCH" });
      setMemories(memories.filter(m => m.id !== id));
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/reject`, { method: "PATCH" });
      setMemories(memories.filter(m => m.id !== id));
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/delete`, { method: "DELETE" });
      setMemories(memories.filter(m => m.id !== id));
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this memory? This cannot be undone!")) return;
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/permanent-delete`, { method: "DELETE" });
      setMemories(memories.filter(m => m.id !== id));
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleSetWinner = async (id) => {
    if (!window.confirm("Set this memory as Today's Winner?")) return;
    try {
     await fetchWithNgrok(`${API_URL}/api/memories/${id}/set-winner`, { method: "PATCH" });
      alert("Winner set successfully!");
      fetchApproved();
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleMoveToPending = async (id) => {
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/pending`, { method: "PATCH" });
      setMemories(memories.filter(m => m.id !== id));
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setApprovedFilter("all");
    setSelectedIds([]);
    setApprovedDateFilter("all");
    if (tab === "pending") fetchPending();
    else if (tab === "approved") fetchApproved();
    else if (tab === "rejected") fetchRejected();
  };

  const getFilteredMemories = () => {
    let filtered = [...memories];

    // Date filter — approved tab pe hamesha apply hoga
    if (activeTab === "approved" && approvedDateFilter !== "all") {
      const now = new Date();
      if (approvedDateFilter === "today") {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(m => new Date(m.created_at) >= today);
      } else if (approvedDateFilter === "yesterday") {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(m => new Date(m.created_at) >= yesterday && new Date(m.created_at) < today);
      } else if (approvedDateFilter === "week") {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(m => new Date(m.created_at) >= weekAgo);
      } else if (approvedDateFilter === "month") {
        const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(m => new Date(m.created_at) >= monthAgo);
      }
    }

    // Most liked / shared filter
    if (activeTab === "approved" && approvedFilter !== "all") {
      const now = new Date();
      if (approvedTimePeriod === "today") {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(m => new Date(m.created_at) >= today);
      } else if (approvedTimePeriod === "yesterday") {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); yesterday.setHours(0, 0, 0, 0);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        filtered = filtered.filter(m => new Date(m.created_at) >= yesterday && new Date(m.created_at) < today);
      } else if (approvedTimePeriod === "week") {
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(m => new Date(m.created_at) >= weekAgo);
      } else if (approvedTimePeriod === "month") {
        const monthAgo = new Date(now); monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(m => new Date(m.created_at) >= monthAgo);
      } else if (approvedTimePeriod === "custom" && customStart && customEnd) {
        const start = new Date(customStart);
        const end = new Date(customEnd); end.setHours(23, 59, 59);
        filtered = filtered.filter(m => new Date(m.created_at) >= start && new Date(m.created_at) <= end);
      }
      if (approvedFilter === "liked") filtered = filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);
      else if (approvedFilter === "shared") filtered = filtered.sort((a, b) => (b.shares || 0) - (a.shares || 0)).slice(0, 10);
    }

    return filtered;
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (currentPageIds) => {
    if (selectedIds.length === currentPageIds.length) setSelectedIds([]);
    else setSelectedIds(currentPageIds);
  };

  const handleBulkApprove = async () => {
    if (!window.confirm(`Approve ${selectedIds.length} memories?`)) return;
    try {
      await Promise.all(selectedIds.map(id => fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/approve`, { method: "PATCH" })));
      setMemories(memories.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleBulkReject = async () => {
    if (!window.confirm(`Reject ${selectedIds.length} memories?`)) return;
    try {
      await Promise.all(selectedIds.map(id => fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/reject`, { method: "PATCH" })));
      setMemories(memories.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleBulkMoveToPending = async () => {
    if (!window.confirm(`Move ${selectedIds.length} memories to Pending?`)) return;
    try {
      await Promise.all(selectedIds.map(id => fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/pending`, { method: "PATCH" })));
      setMemories(memories.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleBulkMoveToApproved = async () => {
    if (!window.confirm(`Move ${selectedIds.length} memories to Approved?`)) return;
    try {
      await Promise.all(selectedIds.map(id => fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/approve`, { method: "PATCH" })));
      setMemories(memories.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleBulkPermanentDelete = async () => {
    if (!window.confirm(`Permanently delete ${selectedIds.length} memories?`)) return;
    try {
      await Promise.all(selectedIds.map(id => fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/permanent-delete`, { method: "DELETE" })));
      setMemories(memories.filter(m => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      fetchStats();
    } catch (err) { console.error(err); }
  };

  const handleExportCSV = (winnersOnly = false) => {
    const dataToExport = winnersOnly ? memories.filter(m => m.is_winner) : memories;
    const headers = ["Name", "Email", "Mobile", "City", "State", "Story Title", "Description", "Year", "Category", "Likes", "Shares", "Winner", "Images", "Videos", "Created At"];
    const rows = dataToExport.map(m => [
      m.name, m.email, `+60${m.mobile}`, m.city, m.state,
      m.story_title, m.description, m.year, m.category, m.likes, m.shares || 0,
      m.is_winner ? "Yes" : "No",
      (m.images || []).join(" | "), (m.videos || []).join(" | "),
      new Date(m.created_at).toLocaleDateString()
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${winnersOnly ? "winners" : "approved-memories"}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const hasExtraCol = approvedFilter !== "all";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg mx-auto mb-4">80</div>
            <h1 className="text-2xl font-black text-purple-700">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Tupperware Memory Wall</p>
          </div>
          <div className="flex flex-col gap-4">
            <input type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && (password === ADMIN_PASSWORD ? setIsLoggedIn(true) : alert("Wrong password!"))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400" />
            <button onClick={() => password === ADMIN_PASSWORD ? setIsLoggedIn(true) : alert("Wrong password!")} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90">Login →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-pink-500 px-4 sm:px-8 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-black text-lg">80</div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">Admin Dashboard</h1>
            <p className="text-pink-200 text-xs">Tupperware Memory Wall</p>
          </div>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 bg-white bg-opacity-20 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-opacity-30">
          <LogOut size={14} /> <span className="hidden sm:block">Logout</span>
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-8 py-6 grid grid-cols-4 gap-3 sm:gap-4">
        {[
          { icon: <Users size={20} />, value: stats.total, label: "Total", color: "purple" },
          { icon: <Hourglass size={20} />, value: stats.pending, label: "Pending", color: "yellow" },
          { icon: <ThumbsUp size={20} />, value: stats.approved, label: "Approved", color: "green" },
          { icon: <XCircle size={20} />, value: stats.rejected, label: "Rejected", color: "red" },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className={`bg-white rounded-2xl p-3 sm:p-5 shadow-sm flex items-center gap-2 sm:gap-4 border border-${color}-100`}>
            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-${color}-100 flex items-center justify-center text-${color}-500 flex-shrink-0`}>{icon}</div>
            <div>
              <p className={`text-xl sm:text-2xl font-black text-${color}-500`}>{value}</p>
              <p className="text-xs text-gray-400 font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Filters + Export */}
      <div className="px-4 sm:px-8 flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-3">
          {["pending", "approved", "rejected"].map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === tab ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md" : "bg-white text-gray-500 hover:bg-purple-50 border border-gray-200"}`}>
              {tab === "pending" ? <Clock size={15} /> : tab === "approved" ? <CheckCircle size={15} /> : <XCircle size={15} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "pending" && stats.pending > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "pending" ? "bg-white text-purple-600" : "bg-pink-500 text-white"}`}>{stats.pending}</span>
              )}
              {tab === "rejected" && stats.rejected > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "rejected" ? "bg-white text-purple-600" : "bg-red-500 text-white"}`}>{stats.rejected}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === "approved" && (
            <>
              {["all", "liked", "shared"].map(f => (
                <button key={f} onClick={() => { setApprovedFilter(f); setCurrentPage(1); }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${approvedFilter === f ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-purple-50"}`}>
                  {f === "liked" && <Heart size={13} />}
                  {f === "shared" && <Share2 size={13} />}
                  {f === "all" ? "All" : f === "liked" ? "Most Liked" : "Most Shared"}
                </button>
              ))}

              {/* Time filter for liked/shared */}
              {/* {approvedFilter !== "all" && (
                <div ref={timeFilterRef} className="relative">
                  <button onClick={() => setTimeFilterOpen(!timeFilterOpen)} className="flex items-center gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-3 py-1.5 rounded-full hover:bg-purple-50">
                    {timePeriodLabels[approvedTimePeriod]}
                    <ChevronDown size={13} className={`transition-transform ${timeFilterOpen ? "rotate-180" : ""}`} />
                  </button>
                  {timeFilterOpen && (
                    <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-40 py-2">
                      {[{ label: "Today", value: "today" }, { label: "Yesterday", value: "yesterday" }, { label: "This Week", value: "week" }, { label: "This Month", value: "month" }, { label: "Custom Date", value: "custom" }].map(opt => (
                        <button key={opt.value} onClick={() => { setApprovedTimePeriod(opt.value); setTimeFilterOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 ${approvedTimePeriod === opt.value ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"}`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {approvedFilter !== "all" && approvedTimePeriod === "custom" && (
                <div className="flex items-center gap-2">
                  <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-purple-400" />
                  <span className="text-gray-400 text-xs">to</span>
                  <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-purple-400" />
                </div>
              )} */}

              {/* Date filter — hamesha dikhega approved tab pe */}
              <div ref={approvedDateRef} className="relative">
                <button onClick={() => setApprovedDateFilterOpen(!approvedDateFilterOpen)} className="flex items-center gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-3 py-1.5 rounded-full hover:bg-purple-50">
                  {datePeriodLabels[approvedDateFilter]}
                  <ChevronDown size={13} className={`transition-transform ${approvedDateFilterOpen ? "rotate-180" : ""}`} />
                </button>
                {approvedDateFilterOpen && (
                  <div className="absolute top-10 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-40 py-2">
                    {[{ label: "All Time", value: "all" }, { label: "Today", value: "today" }, { label: "Yesterday", value: "yesterday" }, { label: "This Week", value: "week" }, { label: "This Month", value: "month" }].map(opt => (
                      <button key={opt.value} onClick={() => { setApprovedDateFilter(opt.value); setApprovedDateFilterOpen(false); setCurrentPage(1); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 ${approvedDateFilter === opt.value ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Export buttons */}
              {memories.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => handleExportCSV(false)} className="flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700">
                    <Download size={15} /> Export CSV
                  </button>
                  {/* <button onClick={() => handleExportCSV(true)} className="flex items-center gap-2 bg-yellow-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-yellow-600">
                    <Trophy size={15} /> Winners CSV
                  </button> */}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Action Bars */}
      {activeTab === "pending" && selectedIds.length > 0 && (
        <div className="px-4 sm:px-8 mb-4">
          <div className="bg-purple-100 border border-purple-200 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-semibold text-purple-700">{selectedIds.length} selected</p>
            <div className="flex gap-2">
              <button onClick={handleBulkApprove} className="flex items-center gap-1 bg-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-600"><CheckCircle size={14} /> Approve</button>
              <button onClick={handleBulkReject} className="flex items-center gap-1 bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-600"><XCircle size={14} /> Reject</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "approved" && selectedIds.length > 0 && (
        <div className="px-4 sm:px-8 mb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-semibold text-green-700">{selectedIds.length} selected</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={handleBulkMoveToPending} className="flex items-center gap-1 bg-yellow-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-yellow-600"><RotateCcw size={14} /> Move to Pending</button>
              <button onClick={handleBulkReject} className="flex items-center gap-1 bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-600"><XCircle size={14} /> Reject</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "rejected" && selectedIds.length > 0 && (
        <div className="px-4 sm:px-8 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-semibold text-red-700">{selectedIds.length} selected</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={handleBulkMoveToPending} className="flex items-center gap-1 bg-yellow-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-yellow-600"><RotateCcw size={14} /> Move to Pending</button>
              <button onClick={handleBulkMoveToApproved} className="flex items-center gap-1 bg-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-600"><CheckCircle size={14} /> Move to Approved</button>
              <button onClick={handleBulkPermanentDelete} className="flex items-center gap-1 bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-600"><Trash2 size={14} /> Permanent Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="px-4 sm:px-8 pb-8">
        {loading ? (
          <div className="text-center py-20"><p className="text-gray-400">Loading...</p></div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-400 font-semibold">
              {activeTab === "pending" ? "No pending submissions!" : activeTab === "approved" ? "No approved memories yet!" : "No rejected memories!"}
            </p>
          </div>
        ) : (() => {
          const filteredMems = getFilteredMemories();
          const totalPages = Math.ceil(filteredMems.length / ITEMS_PER_PAGE);
          const paginatedMemories = filteredMems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          return (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">

              {/* Desktop Header */}
              <div className="hidden sm:grid grid-cols-12 gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 text-xs font-black text-purple-600 uppercase tracking-wide items-center">
                <div className="col-span-2 flex items-center gap-2">
                  {(activeTab === "pending" || activeTab === "rejected" || activeTab === "approved") && (
                    <input type="checkbox" checked={selectedIds.length > 0 && selectedIds.length === paginatedMemories.length} onChange={() => toggleSelectAll(paginatedMemories.map(m => m.id))} className="w-3.5 h-3.5 cursor-pointer" />
                  )}
                  <span>Name</span>
                </div>
                <div className="col-span-2">Email</div>
                <div className="col-span-1">Mobile</div>
                <div className="col-span-1">Location</div>
                {approvedFilter === "liked" && <div className="col-span-1 flex items-center gap-1 text-red-500"><Heart size={13} className="fill-red-500" /> Likes</div>}
                {approvedFilter === "shared" && <div className="col-span-1 flex items-center gap-1 text-purple-500"><Share2 size={13} /> Shares</div>}
                <div className={hasExtraCol ? "col-span-2" : "col-span-2"}>Title</div>
                <div className={hasExtraCol ? "col-span-1" : "col-span-2"}>Description</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Mobile Header */}
              <div className="sm:hidden grid grid-cols-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 text-xs font-black text-purple-600 uppercase tracking-wide">
                <div>Name</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Rows */}
              {paginatedMemories.map((memory, index) => (
                <div key={memory.id} className={`border-b border-gray-50 hover:bg-purple-50 transition-all ${
                  memory.is_winner
                    ? "bg-yellow-50 border-l-4 border-l-yellow-400"
                    : index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}>

                  {/* Desktop Row */}
                  <div className="hidden sm:grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm">
                    <div className="col-span-2 flex items-center gap-2">
                      {(activeTab === "pending" || activeTab === "rejected" || activeTab === "approved") && (
                        <input type="checkbox" checked={selectedIds.includes(memory.id)} onChange={() => toggleSelect(memory.id)} className="w-3.5 h-3.5 cursor-pointer flex-shrink-0" />
                      )}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{memory.name?.charAt(0)}</div>
                      <span className="font-bold text-gray-700 truncate">{memory.name}</span>
                      {memory.is_winner && <Trophy size={13} className="text-yellow-500 flex-shrink-0" />}
                    </div>
                    <div className="col-span-2 text-gray-500 truncate text-xs">{memory.email}</div>
                    <div className="col-span-1 text-gray-500 truncate text-xs">+60 {memory.mobile}</div>
                    <div className="col-span-1 text-gray-500 truncate text-xs">{memory.city}</div>
                    {approvedFilter === "liked" && (
                      <div className="col-span-1">
                        <span className="bg-red-100 text-red-500 text-xs font-black px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                          <Heart size={11} className="fill-red-500" /> {memory.likes || 0}
                        </span>
                      </div>
                    )}
                    {approvedFilter === "shared" && (
                      <div className="col-span-1">
                        <span className="bg-purple-100 text-purple-600 text-xs font-black px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                          <Share2 size={11} /> {memory.shares || 0}
                        </span>
                      </div>
                    )}
                    <div className={`text-gray-600 text-xs ${hasExtraCol ? "col-span-2" : "col-span-2"}`}>
                      <TextExpandable text={memory.story_title} maxLength={25} />
                    </div>
                    <div className={`text-gray-500 text-xs ${hasExtraCol ? "col-span-1" : "col-span-2"}`}>
                      <TextExpandable text={memory.description} maxLength={30} />
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      {activeTab === "pending" && (
                        <>
                          <button onClick={() => handleApprove(memory.id)} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600" title="Approve"><CheckCircle size={13} /></button>
                          <button onClick={() => handleReject(memory.id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600" title="Reject"><XCircle size={13} /></button>
                        </>
                      )}
                      {activeTab === "approved" && (
                        <>
                          <button onClick={() => handleSetWinner(memory.id)} className="p-1.5 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500" title="Set as Winner"><Trophy size={13} /></button>
                          <button onClick={() => handleMoveToPending(memory.id)} className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" title="Move to Pending"><RotateCcw size={13} /></button>
                          <button onClick={() => handleDelete(memory.id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600" title="Delete"><Trash2 size={13} /></button>
                        </>
                      )}
                      {activeTab === "rejected" && (
                        <>
                          <button onClick={() => handleMoveToPending(memory.id)} className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600" title="Move to Pending"><RotateCcw size={13} /></button>
                          <button onClick={() => handleApprove(memory.id)} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600" title="Move to Approved"><CheckCircle size={13} /></button>
                          <button onClick={() => handlePermanentDelete(memory.id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600" title="Permanent Delete"><Trash2 size={13} /></button>
                        </>
                      )}
                      <button onClick={() => setSelectedMemory(memory)} className="p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600" title="View"><Eye size={13} /></button>
                    </div>
                  </div>

                  {/* Mobile Row */}
                  <div className="sm:hidden flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      {(activeTab === "pending" || activeTab === "rejected" || activeTab === "approved") && (
                        <input type="checkbox" checked={selectedIds.includes(memory.id)} onChange={() => toggleSelect(memory.id)} className="w-3.5 h-3.5 cursor-pointer" />
                      )}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{memory.name?.charAt(0)}</div>
                      <span className="font-bold text-gray-700 text-sm">{memory.name}</span>
                      {memory.is_winner && <Trophy size={13} className="text-yellow-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-1">
                      {activeTab === "pending" && (
                        <>
                          <button onClick={() => handleApprove(memory.id)} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"><CheckCircle size={14} /></button>
                          <button onClick={() => handleReject(memory.id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"><XCircle size={14} /></button>
                        </>
                      )}
                      {activeTab === "approved" && (
                        <>
                          <button onClick={() => handleSetWinner(memory.id)} className="p-1.5 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500"><Trophy size={14} /></button>
                          <button onClick={() => handleMoveToPending(memory.id)} className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"><RotateCcw size={14} /></button>
                          <button onClick={() => handleDelete(memory.id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"><Trash2 size={14} /></button>
                        </>
                      )}
                      {activeTab === "rejected" && (
                        <>
                          <button onClick={() => handleMoveToPending(memory.id)} className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"><RotateCcw size={14} /></button>
                          <button onClick={() => handleApprove(memory.id)} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"><CheckCircle size={14} /></button>
                          <button onClick={() => handlePermanentDelete(memory.id)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"><Trash2 size={14} /></button>
                        </>
                      )}
                      <button onClick={() => setSelectedMemory(memory)} className="p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600"><Eye size={14} /></button>
                    </div>
                  </div>

                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                  <p className="text-sm text-gray-400">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredMems.length)} of {filteredMems.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page ? "bg-purple-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-purple-50"}`}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
                  </div>
                </div>
              )}

            </div>
          );
        })()}
      </div>

      {selectedMemory && (
        <ViewPopup
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handlePermanentDelete}
          onMoveToPending={handleMoveToPending}
          isApproved={activeTab === "approved"}
          activeTab={activeTab}
        />
      )}
    </div>
  );
};

export default AdminDashboard;