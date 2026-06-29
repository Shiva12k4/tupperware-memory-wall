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

const periodOptions = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

const FilterBar = ({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  period,
  setPeriod,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const categoryRef = useRef(null);
  const filterRef = useRef(null);
  const categoryRefMobile = useRef(null);
  const filterRefMobile = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      const inCategoryDesktop = categoryRef.current?.contains(e.target);
      const inCategoryMobile = categoryRefMobile.current?.contains(e.target);
      const inFilterDesktop = filterRef.current?.contains(e.target);
      const inFilterMobile = filterRefMobile.current?.contains(e.target);

      if (!inCategoryDesktop && !inCategoryMobile) setCategoryOpen(false);
      if (!inFilterDesktop && !inFilterMobile) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activePeriodLabel = periodOptions.find((p) => p.value === period)?.label || "All Time";

  return (
    <div className="bg-transparent px-6 py-3">

      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-between gap-3">

        <div className="flex items-center gap-3">

          {/* Categories Dropdown — Desktop */}
          {/* <div ref={categoryRef} className="relative">
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
          </div> */}

          {/* Period Dropdown — Desktop */}
          <div ref={filterRef} className="relative">
            <button
              onClick={() => { setFilterOpen(!filterOpen); setCategoryOpen(false); }}
              className="flex items-center gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              {activePeriodLabel}
              <ChevronDown size={14} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute top-11 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-48 py-2">
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

        {/* Search */}
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

        {/* Search */}
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

        <div className="flex gap-3">

          {/* Categories Dropdown — Mobile */}
          {/* <div ref={categoryRefMobile} className="relative flex-1">
            <button
              onClick={() => { setCategoryOpen(!categoryOpen); setFilterOpen(false); }}
              className="w-full flex items-center justify-between gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              <span className="truncate max-w-28">{activeCategory === "All Memories" ? "Categories" : activeCategory}</span>
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
          </div> */}

          {/* Period Dropdown — Mobile */}
          <div ref={filterRefMobile} className="relative flex-1">
            <button
              onClick={() => { setFilterOpen(!filterOpen); setCategoryOpen(false); }}
              className="w-full flex items-center justify-between gap-2 bg-white border border-gray-200 text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-purple-50 transition-all"
            >
              <span className="truncate">{activePeriodLabel}</span>
              <ChevronDown size={14} className={`transition-transform flex-shrink-0 ${filterOpen ? "rotate-180" : ""}`} />
            </button>
            {filterOpen && (
              <div className="absolute top-11 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-48 py-2">
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