import { useState } from "react";

const categories = [
  "All Memories",
  "Childhood Memories",
  "Mum's Collection",
  "Balik Kampung",
  "Vintage Treasures",
  "Three Generations",
];

const FilterBar = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery, viewMode, setViewMode }) => {
  return (
 <div className="bg-transparent px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
           className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
  activeCategory === cat
    ? "bg-purple-600 text-white shadow-md"
    : cat === "All Memories"
    ? "bg-transparent text-purple-600 hover:bg-purple-100 hover:text-purple-700"
    : "bg-white text-purple-600 hover:bg-purple-100 hover:text-purple-700"
}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Right — Search + View Toggle */}
      <div className="flex items-center gap-3">
        {/* Search */}
       <div className="flex items-center bg-white rounded-full px-4 py-2 gap-2">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none text-gray-600 w-40"
          />
        </div>

        {/* Grid/List Toggle */}
       <div className="flex items-center bg-white rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-2 text-sm transition-all ${
              viewMode === "grid"
                ? "bg-purple-600 text-white"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            ⊞
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-2 text-sm transition-all ${
              viewMode === "list"
                ? "bg-purple-600 text-white"
                : "text-gray-500 hover:bg-gray-200"
            }`}
          >
            ☰
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;