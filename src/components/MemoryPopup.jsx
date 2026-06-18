import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const MemoryPopup = ({ memory, onClose }) => {
  const allMedia = [
    ...(memory.images || []).map((url) => ({ type: "image", url })),
    ...(memory.videos || []).map((url) => ({ type: "video", url })),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setCurrentIndex((i) => (i === 0 ? allMedia.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === allMedia.length - 1 ? 0 : i + 1));

  const yearColors = [
    "bg-pink-400", "bg-purple-400", "bg-yellow-400",
    "bg-orange-400", "bg-green-400", "bg-blue-400",
  ];
  const yearColor = yearColors[memory.id % yearColors.length];

  return (
    <>
      {/* Main Popup */}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
       <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
          >
            <X size={16} className="text-gray-600" />
          </button>

          {/* Media Slideshow */}
          {allMedia.length > 0 && (
           <div className="relative w-full h-80 bg-gray-100 overflow-hidden">

              {allMedia[currentIndex].type === "image" ? (
                <img
                  src={allMedia[currentIndex].url}
                  alt="memory"
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setLightbox(true)}
                />
              ) : (
                <video
                  src={allMedia[currentIndex].url}
                  controls
                  className="w-full h-full object-cover"
                />
              )}

              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow hover:bg-opacity-100"
                  >
                    <ChevronLeft size={16} className="text-gray-700" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow hover:bg-opacity-100"
                  >
                    <ChevronRight size={16} className="text-gray-700" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allMedia.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === currentIndex ? "bg-white w-4" : "bg-white bg-opacity-50 w-2"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute top-3 left-3 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded-full">
                    {currentIndex + 1} / {allMedia.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-5">

            {/* Top — Avatar + Name + Year */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {memory.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-purple-800 text-base">{memory.name}</p>
                  <p className="text-xs text-blue-800 font-semibold">{memory.city}, {memory.state}</p>
                </div>
              </div>
              <span className={`${yearColor} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                {memory.year}
              </span>
            </div>

            {/* Category Badge */}
            <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
              {memory.category}
            </span>

            {/* Story Title */}
            {memory.story_title && (
              <h2 className="text-xl font-black text-purple-800 mt-3 leading-tight">
                {memory.story_title}
              </h2>
            )}

            {/* Description */}
            <p className="text-sm text-blue-800 font-semibold mt-2 leading-relaxed">
              "{memory.description || memory.caption}"
            </p>

            {/* Likes */}
            <div className="flex items-center gap-1 mt-4">
              <span className="text-lg">❤️</span>
              <span className="text-sm font-semibold text-gray-500">{memory.likes} likes</span>
            </div>

          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] px-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40"
          >
            <X size={18} className="text-white" />
          </button>

          <div className="absolute top-4 left-4 bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full">
            {currentIndex + 1} / {allMedia.length}
          </div>

          <div
            className="max-w-4xl w-full max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {allMedia[currentIndex].type === "image" ? (
              <img
                src={allMedia[currentIndex].url}
                alt="memory"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
            ) : (
              <video
                src={allMedia[currentIndex].url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-2xl"
              />
            )}
          </div>

          {allMedia.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40"
              >
                <ChevronLeft size={22} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40"
              >
                <ChevronRight size={22} className="text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MemoryPopup;