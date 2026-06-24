import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  LogOut,
  Users,
  Hourglass,
  ThumbsUp,
  Trash2,
  RotateCcw,
  ChevronRight,
  Download,
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
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-purple-500 hover:text-purple-700 ml-1"
      >
        {expanded ? "less" : <ChevronRight size={14} className="inline" />}
      </button>
    </span>
  );
};

const ViewPopup = ({
  memory,
  onClose,
  onApprove,
  onReject,
  onDelete,
  onMoveToPending,
  isApproved,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ✕
        </button>
        <h2 className="text-xl font-black text-purple-700 mb-4">
          Memory Details
        </h2>

        {memory.images && memory.images.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {memory.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`img-${i}`}
                className="w-32 h-32 object-cover rounded-xl"
              />
            ))}
          </div>
        )}

        {memory.videos && memory.videos.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {memory.videos.map((vid, i) => (
              <video
                key={i}
                src={vid}
                controls
                className="w-48 h-32 rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            ["Name", memory.name],
            ["Email", memory.email],
            ["Mobile", `+60 ${memory.mobile}`],
            ["Location", `${memory.city}, ${memory.state}`],
            ["Category", memory.category],
            ["Year", memory.year || "N/A"],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-sm font-semibold text-gray-700">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-400">Story Title</p>
          <p className="text-sm font-semibold text-gray-700">
            {memory.story_title}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-400">Description</p>
          <p className="text-sm text-gray-700">{memory.description}</p>
        </div>

        {/* Actions in Popup */}
        <div className="flex gap-3 flex-wrap">
          {!isApproved && (
            <>
              <button
                onClick={() => {
                  onApprove(memory.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600"
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                onClick={() => {
                  onReject(memory.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600"
              >
                <XCircle size={16} /> Reject
              </button>
            </>
          )}
          {isApproved && (
            <>
              <button
                onClick={() => {
                  onMoveToPending(memory.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white font-bold py-3 rounded-xl hover:bg-yellow-600"
              >
                <RotateCcw size={16} /> Move to Pending
              </button>
              <button
                onClick={() => {
                  onDelete(memory.id);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600"
              >
                <Trash2 size={16} /> Delete
              </button>
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
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [selectedIds, setSelectedIds] = useState([]);

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
      const res = await fetchWithNgrok(
        `${API_URL}/api/admin/memories/approved`,
      );
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
      const [p, a] = await Promise.all([
        fetchWithNgrok(`${API_URL}/api/admin/memories/pending`).then((r) =>
          r.json(),
        ),
        fetchWithNgrok(`${API_URL}/api/admin/memories/approved`).then((r) =>
          r.json(),
        ),
      ]);
      setStats({
        total: (p.memories?.length || 0) + (a.memories?.length || 0),
        pending: p.memories?.length || 0,
        approved: a.memories?.length || 0,
      });
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
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/approve`, {
        method: "PATCH",
      });
      setMemories(memories.filter((m) => m.id !== id));
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/reject`, {
        method: "PATCH",
      });
      setMemories(memories.filter((m) => m.id !== id));
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this memory?")) return;
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/delete`, {
        method: "DELETE",
      });
      setMemories(memories.filter((m) => m.id !== id));
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveToPending = async (id) => {
    try {
      await fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/pending`, {
        method: "PATCH",
      });
      setMemories(memories.filter((m) => m.id !== id));
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === "pending") fetchPending();
    else fetchApproved();
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (currentPageIds) => {
    if (selectedIds.length === currentPageIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentPageIds);
    }
  };

  const handleBulkApprove = async () => {
    if (!window.confirm(`Approve ${selectedIds.length} memories?`)) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/approve`, {
            method: "PATCH",
          }),
        ),
      );
      setMemories(memories.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkReject = async () => {
    if (!window.confirm(`Reject ${selectedIds.length} memories?`)) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetchWithNgrok(`${API_URL}/api/admin/memories/${id}/reject`, {
            method: "PATCH",
          }),
        ),
      );
      setMemories(memories.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-lg mx-auto mb-4">
              80
            </div>
            <h1 className="text-2xl font-black text-purple-700">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">Tupperware Memory Wall</p>
          </div>
          <div className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (password === ADMIN_PASSWORD
                  ? setIsLoggedIn(true)
                  : alert("Wrong password!"))
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400"
            />
            <button
              onClick={() =>
                password === ADMIN_PASSWORD
                  ? setIsLoggedIn(true)
                  : alert("Wrong password!")
              }
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90"
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
      <div className="bg-gradient-to-r from-purple-700 to-pink-500 px-4 sm:px-8 py-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-black text-lg">
            80
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white">
              Admin Dashboard
            </h1>
            <p className="text-pink-200 text-xs">Tupperware Memory Wall</p>
          </div>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="flex items-center gap-2 bg-white bg-opacity-20 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-opacity-30"
        >
          <LogOut size={14} /> <span className="hidden sm:block">Logout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-8 py-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            icon: <Users size={20} />,
            value: stats.total,
            label: "Total",
            color: "purple",
          },
          {
            icon: <Hourglass size={20} />,
            value: stats.pending,
            label: "Pending",
            color: "yellow",
          },
          {
            icon: <ThumbsUp size={20} />,
            value: stats.approved,
            label: "Approved",
            color: "green",
          },
        ].map(({ icon, value, label, color }) => (
          <div
            key={label}
            className={`bg-white rounded-2xl p-3 sm:p-5 shadow-sm flex items-center gap-2 sm:gap-4 border border-${color}-100`}
          >
            <div
              className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-${color}-100 flex items-center justify-center text-${color}-500 flex-shrink-0`}
            >
              {icon}
            </div>
            <div>
              <p className={`text-xl sm:text-2xl font-black text-${color}-500`}>
                {value}
              </p>
              <p className="text-xs text-gray-400 font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Export */}
      <div className="px-4 sm:px-8 flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-3">
          {["pending", "approved"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === tab ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md" : "bg-white text-gray-500 hover:bg-purple-50 border border-gray-200"}`}
            >
              {tab === "pending" ? (
                <Clock size={15} />
              ) : (
                <CheckCircle size={15} />
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "pending" && stats.pending > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === "pending" ? "bg-white text-purple-600" : "bg-pink-500 text-white"}`}
                >
                  {stats.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "approved" && memories.length > 0 && (
          <button
            onClick={() => {
              const headers = [
                "Name",
                "Email",
                "Mobile",
                "City",
                "State",
                "Story Title",
                "Description",
                "Year",
                "Category",
                "Likes",
                "Images",
                "Videos",
                "Created At",
              ];
              const rows = memories.map((m) => [
                m.name,
                m.email,
                `+60${m.mobile}`,
                m.city,
                m.state,
                m.story_title,
                m.description,
                m.year,
                m.category,
                m.likes,
                (m.images || []).join(" | "),
                (m.videos || []).join(" | "),
                new Date(m.created_at).toLocaleDateString(),
              ]);
              const csvContent = [headers, ...rows]
                .map((row) =>
                  row
                    .map(
                      (cell) => `"${String(cell || "").replace(/"/g, '""')}"`,
                    )
                    .join(","),
                )
                .join("\n");
              const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `approved-memories-${new Date().toISOString().split("T")[0]}.csv`;
              link.click();
            }}
            className="flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Download size={15} /> Export CSV
          </button>
        )}
      </div>

      {/* Bulk Action Bar */}
      {activeTab === "pending" && selectedIds.length > 0 && (
        <div className="px-4 sm:px-8 mb-4">
          <div className="bg-purple-100 border border-purple-200 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <p className="text-sm font-semibold text-purple-700">
              {selectedIds.length} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleBulkApprove}
                className="flex items-center gap-1 bg-green-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-600"
              >
                <CheckCircle size={14} /> Approve Selected
              </button>
              <button
                onClick={handleBulkReject}
                className="flex items-center gap-1 bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-600"
              >
                <XCircle size={14} /> Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="px-4 sm:px-8 pb-8">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">⏳</p>
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-4xl mb-3">
              {activeTab === "pending" ? "✅" : "📭"}
            </p>
            <p className="text-gray-400 font-semibold">
              {activeTab === "pending"
                ? "No pending submissions!"
                : "No approved memories yet!"}
            </p>
          </div>
        ) : (
          (() => {
            const totalPages = Math.ceil(memories.length / ITEMS_PER_PAGE);
            const paginatedMemories = memories.slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE,
            );
            return (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                {/* Desktop Header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 text-xs font-black text-purple-600 uppercase tracking-wide">
                  <div className="col-span-2 flex items-center gap-2">
                    {activeTab === "pending" && (
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length > 0 &&
                          selectedIds.length === paginatedMemories.length
                        }
                        onChange={() =>
                          toggleSelectAll(paginatedMemories.map((m) => m.id))
                        }
                        className="w-3.5 h-3.5 cursor-pointer"
                      />
                    )}
                    <span>Name</span>
                  </div>
                  <div className="col-span-2">Email</div>
                  <div className="col-span-1">Mobile</div>
                  <div className="col-span-1">Location</div>
                  <div className="col-span-1">Category</div>
                  <div className="col-span-2">Title</div>
                  <div className="col-span-2">Description</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Mobile Header */}
                <div className="sm:hidden grid grid-cols-2 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100 text-xs font-black text-purple-600 uppercase tracking-wide">
                  <div>Name</div>
                  <div className="text-right">Actions</div>
                </div>

                {/* Rows */}
                {paginatedMemories.map((memory, index) => (
                  <div
                    key={memory.id}
                    className={`border-b border-gray-50 hover:bg-purple-50 transition-all ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                  >
                    {/* Desktop Row */}
                    <div className="hidden sm:grid grid-cols-12 gap-2 px-6 py-4 items-center text-sm">
                      <div className="col-span-2 flex items-center gap-2">
                        {activeTab === "pending" && (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(memory.id)}
                            onChange={() => toggleSelect(memory.id)}
                            className="w-3.5 h-3.5 cursor-pointer flex-shrink-0"
                          />
                        )}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {memory.name?.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-700 truncate">
                          {memory.name}
                        </span>
                      </div>
                      <div className="col-span-2 text-gray-500 truncate text-xs">
                        {memory.email}
                      </div>
                      <div className="col-span-1 text-gray-500 truncate text-xs">
                        +60 {memory.mobile}
                      </div>
                      <div className="col-span-1 text-gray-500 truncate text-xs">
                        {memory.city}
                      </div>
                      <div className="col-span-1">
                        <span className="bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full truncate block">
                          {memory.category}
                        </span>
                      </div>
                      <div className="col-span-2 text-gray-600 text-xs">
                        <TextExpandable
                          text={memory.story_title}
                          maxLength={25}
                        />
                      </div>
                      <div className="col-span-2 text-gray-500 text-xs">
                        <TextExpandable
                          text={memory.description}
                          maxLength={30}
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-end gap-1">
                        {activeTab === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(memory.id)}
                              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                              title="Approve"
                            >
                              <CheckCircle size={13} />
                            </button>
                            <button
                              onClick={() => handleReject(memory.id)}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              title="Reject"
                            >
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                        {activeTab === "approved" && (
                          <>
                            <button
                              onClick={() => handleMoveToPending(memory.id)}
                              className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                              title="Move to Pending"
                            >
                              <RotateCcw size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(memory.id)}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedMemory(memory)}
                          className="p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                          title="View"
                        >
                          <Eye size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Mobile Row */}
                    <div className="sm:hidden flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2">
                        {activeTab === "pending" && (
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(memory.id)}
                            onChange={() => toggleSelect(memory.id)}
                            className="w-3.5 h-3.5 cursor-pointer"
                          />
                        )}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                          {memory.name?.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-700 text-sm">
                          {memory.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {activeTab === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(memory.id)}
                              className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => handleReject(memory.id)}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                        {activeTab === "approved" && (
                          <>
                            <button
                              onClick={() => handleMoveToPending(memory.id)}
                              className="p-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                            >
                              <RotateCcw size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(memory.id)}
                              className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedMemory(memory)}
                          className="p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
                      {Math.min(currentPage * ITEMS_PER_PAGE, memories.length)}{" "}
                      of {memories.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === page ? "bg-purple-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-purple-50"}`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-500 hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}
      </div>

      {selectedMemory && (
        <ViewPopup
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onMoveToPending={handleMoveToPending}
          isApproved={activeTab === "approved"}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
