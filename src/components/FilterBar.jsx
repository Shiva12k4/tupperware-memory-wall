import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";

const categories = [
  "All Memories",
  "Childhood Memories",
  "Funniest Memories",
  "My Favorite Tupperware Product",
  "Vintage Treasures (My Oldest Tupperware Product)",
  "Three Generations (From Grandma to Me)",
  "Other Memories",
];

const sortOptions = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Liked", value: "liked" },
  { label: "Most Shared", value: "shared" },
];

const periodOptions = [
  { label: "All Time", value: "all" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const FilterBar = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  period,
  setPeriod,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const categoryRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeSortLabel = sortOptions.find((s) => s.value === sortBy)?.label || "Sort";
  const activePeriodLabel = periodOptions.find((p) => p.value === period)?.label || "All Time";

  return (
    <div className="bg-transparent px-6 py-3">

      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between gap-3">

        {/* Left — Dropdowns */}
        <div className="flex items-center gap-3">

          {/* Categories Dropdown */}
          <div ref={categoryRef} className="relative">
            <button
              onClick={() => { setCategoryOpen(!categoryOpen); setFilterOpen(false); }}
              className="flex items-center gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              {activeCategory === "All Memories" ? "Categories" : activeCategory}
              <ChevronDown size={14} className={`transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
            </button>
            {categoryOpen && (
              <div className="absolute top-11 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-48 py-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setCategoryOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-purple-50 ${
                      activeCategory === cat ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter/Sort Dropdown */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen(!filterOpen); setCategoryOpen(false); }}
              className="flex items-center gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              {activeSortLabel} · {activePeriodLabel}
              <ChevronDown size={14} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute top-11 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-52 py-2">
                <p className="text-xs text-gray-400 font-bold uppercase px-4 py-1">Sort By</p>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                     onClick={() => { setSortBy(opt.value); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-purple-50 ${
                      sortBy === opt.value ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                <div className="border-t border-gray-100 my-1" />
                <p className="text-xs text-gray-400 font-bold uppercase px-4 py-1">Time Period</p>
                {periodOptions.map((opt) => (
                  <button
                    key={opt.value}
                   onClick={() => { setPeriod(opt.value); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-purple-50 ${
                      period === opt.value ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right — Search */}
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 gap-2 w-72">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none text-gray-600 flex-1"
          />
          <Search size={16} className="text-gray-400 flex-shrink-0" />
        </div>

      </div>

      {/* Mobile */}
      <div className="flex sm:hidden flex-col gap-3">

        {/* Search — Full Width */}
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 gap-2 w-full">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none text-gray-600 flex-1"
          />
          <Search size={16} className="text-gray-400 flex-shrink-0" />
        </div>

        {/* Dropdowns Row */}
        <div className="flex gap-3">

          {/* Categories Dropdown */}
          <div ref={categoryRef} className="relative flex-1">
            <button
              onClick={() => { setCategoryOpen(!categoryOpen); setFilterOpen(false); }}
              className="w-full flex items-center justify-between gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              <span className="truncate">{activeCategory === "All Memories" ? "Categories" : activeCategory}</span>
              <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${categoryOpen ? "rotate-180" : ""}`} />
            </button>
            {categoryOpen && (
              <div className="absolute top-11 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-48 py-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setCategoryOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-purple-50 ${
                      activeCategory === cat ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Dropdown */}
          <div ref={filterRef} className="relative flex-1">
            <button
              onClick={() => { setFilterOpen(!filterOpen); setCategoryOpen(false); }}
              className="w-full flex items-center justify-between gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              <span className="truncate">{activeSortLabel}</span>
              <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute top-11 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-52 py-2">
                <p className="text-xs text-gray-400 font-bold uppercase px-4 py-1">Sort By</p>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                     onClick={() => { setSortBy(opt.value); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-purple-50 ${
                      sortBy === opt.value ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
                <div className="border-t border-gray-100 my-1" />
                <p className="text-xs text-gray-400 font-bold uppercase px-4 py-1">Time Period</p>
                {periodOptions.map((opt) => (
                  <button
                    key={opt.value}
                     onClick={() => { setPeriod(opt.value); setFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-purple-50 ${
                      period === opt.value ? "text-purple-600 font-bold bg-purple-50" : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default FilterBar;