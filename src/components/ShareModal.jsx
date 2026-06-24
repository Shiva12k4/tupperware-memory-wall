import { useState } from "react";
import API_URL, { fetchWithNgrok } from "../api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ShareModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    story_title: "",
    description: "",
    year: "",
    category: "Childhood Memories",
    terms_accepted: false,
    marketing_consent: false,
    content_consent: false,
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState({});

  const malaysiaStates = [
    "Johor",
    "Kedah",
    "Kelantan",
    "Kuala Lumpur",
    "Labuan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Penang",
    "Perak",
    "Perlis",
    "Putrajaya",
    "Sabah",
    "Sarawak",
    "Selangor",
    "Terengganu",
  ];

  const categories = [
    "Childhood Memories",
    "Mum's Collection",
    "Balik Kampung",
    "Vintage Treasures",
    "Three Generations",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed!");
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.8,
      fileType: "image/webp",
    };

    try {
      const compressed = await Promise.all(
        files.map((file) => imageCompression(file, options)),
      );
      setImages(compressed);
    } catch (err) {
      console.error("Compression error:", err);
      setImages(files);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(images);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setImages(reordered);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleVideos = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 2) {
      alert("Maximum 2 videos allowed!");
      return;
    }
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        alert("Each video must be under 20MB!");
        return;
      }
    }
    setVideos(files);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.story_title)
      newErrors.story_title = "Story title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!formData.terms_accepted) {
      alert("Please accept Terms & Conditions!");
      return;
    }
    if (!formData.marketing_consent) {
      alert("Please accept Marketing Consent!");
      return;
    }
    if (!formData.content_consent) {
      alert("Please accept Content Usage Consent!");
      return;
    }

    // Video size check
    for (const video of videos) {
      if (video.size > 20 * 1024 * 1024) {
        alert("Each video must be under 20MB!");
        return;
      }
    }
    if (images.length === 0) {
      alert("Please upload at least one photo!");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("city", formData.city);
      data.append("state", formData.state);
      data.append("story_title", formData.story_title);
      data.append("description", formData.description);
      data.append("year", formData.year);
      data.append("category", formData.category);
      data.append("terms_accepted", formData.terms_accepted);
      data.append("marketing_consent", formData.marketing_consent);
      data.append("content_consent", formData.content_consent);

      images.forEach((img) => data.append("images", img));
      videos.forEach((vid) => data.append("videos", vid));

      const response = await fetchWithNgrok(`${API_URL}/api/submit-memory`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem(
          "myMemory",
          JSON.stringify({
            name: formData.name,
            city: formData.city,
            state: formData.state,
            year: formData.year || new Date().getFullYear().toString(),
            story_title: formData.story_title,
            description: formData.description,
            image: result.memory.images?.[0] || null,
            video: result.memory.videos?.[0] || null,
          }),
        );
        setSubmitted(true);
      } else {
        alert(result.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >
          ✕
        </button>

        {!submitted ? (
          <>
            {/* Title */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-purple-700">
                Share Your Memory
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Be part of Malaysia's largest memory collection
              </p>

              {/* Steps Indicator */}
              {/* Steps Indicator */}
              <div className="flex items-center justify-center mt-4">
                {[1, 2, 3].map((s, index) => (
                  <div key={s} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          step === s
                            ? "bg-purple-600 text-white"
                            : step > s
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {step > s ? "✓" : s}
                      </div>
                      <span className="text-xs text-gray-400 mt-1 w-16 text-center">
                        {s === 1 ? "Personal" : s === 2 ? "Memory" : "Upload"}
                      </span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`w-12 h-0.5 mb-4 mx-1 ${step > s ? "bg-green-500" : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1 — Personal Info */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Aisyah Rahman"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. aisyah@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Mobile Number *
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-400">
                    <span className="bg-gray-50 px-3 py-2 text-sm text-gray-500 border-r border-gray-200 font-semibold">
                      🇲🇾 +60
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="123456789"
                      maxLength={10}
                      className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    <option value="">Select your state</option>
                    {malaysiaStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-400 text-xs mt-1">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Petaling Jaya"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                <button
                  onClick={() => validateStep1() && setStep(2)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 mt-2"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 2 — Memory Details */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    name="story_title"
                    value={formData.story_title}
                    onChange={handleChange}
                    placeholder="e.g. My First Tupperware"
                    maxLength={40}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />
                  {errors.story_title && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.story_title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Memory Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Share your Tupperware memory..."
                    rows={4}
                    maxLength={300}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400 resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                    {errors.description && (
                      <p className="text-red-400 text-xs">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 ml-auto">
                      {formData.description.length}/300
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Year of Memory (Optional)
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="e.g. 1995"
                    min="1950"
                    max={new Date().getFullYear()}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-purple-400 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => validateStep2() && setStep(3)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Upload + Consent */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                {/* Images */}
                {/* Images */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Photos (Max 5) *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />

                  {/* Drag & Drop Preview */}
                  {images.length > 0 && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="images">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="mt-3 flex flex-col gap-2"
                          >
                            {images.map((img, index) => (
                              <Draggable
                                key={img.name}
                                draggableId={img.name}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`flex items-center gap-3 bg-purple-50 rounded-xl p-2 border transition-all ${
                                      snapshot.isDragging
                                        ? "border-purple-400 shadow-lg"
                                        : "border-purple-100"
                                    }`}
                                  >
                                    {/* Drag Handle */}
                                    <div
                                      {...provided.dragHandleProps}
                                      className="text-gray-400 cursor-grab active:cursor-grabbing px-1"
                                    >
                                      ⠿
                                    </div>

                                    {/* Image Preview */}
                                    <img
                                      src={URL.createObjectURL(img)}
                                      alt={`preview-${index}`}
                                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                                    />

                                    {/* Name + Order */}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-purple-700 truncate">
                                        {img.name}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {index === 0
                                          ? "🥇 Cover Photo"
                                          : `#${index + 1}`}
                                      </p>
                                    </div>

                                    {/* Remove */}
                                    <button
                                      onClick={() => removeImage(index)}
                                      className="text-red-400 hover:text-red-600 font-bold text-lg flex-shrink-0"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </div>

                {/* Videos */}
                <div>
                  <label className="text-sm font-semibold text-gray-600 mb-1 block">
                    Videos (Max 2, each under 20MB){" "}
                    <span className="text-gray-400 font-normal">
                      — Optional
                    </span>
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideos}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />
                  {videos.length > 0 && (
                    <p className="text-xs text-purple-500 mt-1">
                      {videos.length} video(s) selected
                    </p>
                  )}
                </div>

                {/* Consents */}
                <div className="flex flex-col gap-3 mt-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="terms_accepted"
                      checked={formData.terms_accepted}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-600">
                      I accept the{" "}
                      <span className="text-purple-600 underline cursor-pointer">
                        Terms & Conditions
                      </span>{" "}
                      *
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="marketing_consent"
                      checked={formData.marketing_consent}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-600">
                      I agree to receive marketing communications from
                      Tupperware Malaysia
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="content_consent"
                      checked={formData.content_consent}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-xs text-gray-600">
                      I consent to Tupperware Malaysia using my submitted
                      content for promotional purposes *
                    </span>
                  </label>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border-2 border-purple-400 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Memory →"}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-black text-purple-700 mb-2">
              Memory Submitted!
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Your memory is under review. It will appear on the wall once
              approved!
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold px-8 py-3 rounded-xl hover:opacity-90"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
