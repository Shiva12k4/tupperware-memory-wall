import { useState } from "react";
import API_URL, { fetchWithNgrok } from "../api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import imageCompression from "browser-image-compression";
import { X } from "lucide-react";

const TCModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] px-4">
    <div
      className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col"
      style={{ maxHeight: "80vh" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-lg font-black text-purple-700">
          Terms & Conditions
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto px-6 py-4 flex-1 text-sm text-gray-600 leading-relaxed">
        <p className="italic mb-4">
          These Terms & Conditions ("Terms") govern participation in the
          Tupperware Digital Heritage Wall (the "Campaign"). By submitting any
          content to the Campaign, you confirm that you have read, understood,
          and agree to be bound by these Terms.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">1. Organiser</h3>
        <p className="mb-3">
          The Campaign is organised by Tupperware Brands Malaysia Sdn. Bhd.
          (Company No. 199401001646) of Unit 12-1, Level 12, Tower 2A UOA
          Business Park No.1, Jalan Pengaturcara U1/51a, Seksyen U1 40150 Shah
          Alam, Selangor ("Tupperware" or the "Organiser").
        </p>

        <h3 className="text-purple-700 font-bold mb-1">2. Eligibility</h3>
        <p className="mb-3">
          Participation is open to residents of Malaysia aged eighteen (18)
          years and above at the time of submission. Submissions from or on
          behalf of individuals under the age of eighteen (18) will not be
          accepted.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          3. Participation and Submissions
        </h3>
        <p className="mb-3">
          By uploading, posting, or otherwise submitting any message,
          photograph, video, audio recording, artwork, testimonial, or other
          material to the Digital Heritage Wall, the participant agrees to be
          bound by these Terms.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          4. Content Guidelines and Moderation
        </h3>
        <p className="mb-1">
          Participants represent and undertake that their Submission:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>
            is original work created by the participant, or that the participant
            holds all rights necessary to submit it;
          </li>
          <li>
            does not infringe any third-party intellectual property, privacy, or
            other rights;
          </li>
          <li>
            does not contain defamatory, obscene, threatening, harassing, or
            discriminatory material;
          </li>
          <li>
            does not contain personal data of any other identifiable individual
            without prior written consent;
          </li>
          <li>
            does not contain any commercial advertising or promotion of
            third-party brands;
          </li>
          <li>complies with all applicable laws of Malaysia.</li>
        </ul>

        <h3 className="text-purple-700 font-bold mb-1">5. Grant of Rights</h3>
        <p className="mb-3">
          By submitting a Submission, the participant grants to the Organiser a
          perpetual, irrevocable, worldwide, royalty-free, non-exclusive licence
          to use, reproduce, publish, display, distribute, and otherwise
          communicate the Submission in any media for any purpose connected with
          the Organiser's business.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          6. Consent to Use of Name and Likeness
        </h3>
        <p className="mb-3">
          The participant acknowledges that their name, likeness, image, and
          biographical information may be displayed publicly on the Digital
          Heritage Wall, websites, social media platforms, and marketing
          materials, without further notice or compensation.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          7. Personal Data Protection
        </h3>
        <p className="mb-3">
          The Organiser processes personal data in accordance with the Personal
          Data Protection Act 2010 (PDPA). By submitting, the participant
          consents to collection and use of their personal data for
          administration of the Campaign, public display of Submissions,
          marketing communications, and disclosure to affiliates and service
          providers. Privacy Notice:{" "}
          <a
            href="https://shop.tupperwarebrands.com.my/pages/privacy-policy?ref=1508168"
            target="_blank"
            className="text-purple-600 underline"
          >
            View Privacy Policy
          </a>
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          8. Retention and Archival Use
        </h3>
        <p className="mb-3">
          Submissions and associated personal data may be retained indefinitely
          by the Organiser as part of its brand heritage archive.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          9. Participant Warranties
        </h3>
        <p className="mb-3">
          The participant warrants that they own or have secured all rights
          necessary to make the Submission, every individual identifiable in the
          Submission has consented, and the Submission complies with all
          applicable laws.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          10. Limitation of Liability
        </h3>
        <p className="mb-3">
          To the maximum extent permitted by Malaysian law, the Organiser shall
          not be liable for any loss, damage, or expense arising out of or in
          connection with the Campaign.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">
          11. Modification and Termination
        </h3>
        <p className="mb-3">
          The Organiser reserves the right to amend these Terms or terminate the
          Campaign at any time. The licence granted shall survive any such
          termination.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">12. Governing Law</h3>
        <p className="mb-3">
          These Terms shall be governed by the laws of Malaysia. The participant
          submits to the exclusive jurisdiction of the courts of Malaysia.
        </p>

        <h3 className="text-purple-700 font-bold mb-1">13. General</h3>
        <p className="mb-3">
          If any provision is found invalid, the remaining provisions shall
          continue in full force. These Terms constitute the entire agreement
          between the Organiser and the participant.
        </p>

        <p className="text-gray-400 text-xs mt-2">
          For queries, please contact the Organiser at [contact email].
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90"
        >
          I Understand
        </button>
      </div>
    </div>
  </div>
);

const ShareModal = ({ onClose, onSubmitStart, onSubmitSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTC, setShowTC] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    story_title: "",
    description: "",
    year: "",
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

  // const categories = [
  //   "All Memories",
  //   "Childhood Memories",
  //   "Funniest Memories",
  //   "My Favorite Tupperware Product",
  //   "Vintage Treasures (My Oldest Tupperware Product)",
  //   "Three Generations (From Grandma to Me)",
  //   "Other Memories",
  // ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "name") {
      // Har word ka pehla letter capital
      const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());
      setFormData({ ...formData, [name]: capitalized });
      return;
    }
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
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.mobile) {
      newErrors.mobile = "Mobile is required";
    } else if (formData.mobile.length < 9 || formData.mobile.length > 12) {
      newErrors.mobile = "Mobile number must be 9-12 digits";
    }
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
    if (formData.year) {
      const y = parseInt(formData.year);
      if (formData.year.length !== 4) {
        newErrors.year = "Please enter a valid 4-digit year";
      } else if (y < 1946 || y > 2026) {
        newErrors.year = "Year must be between 1946 and 2026";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const consentErrors = {};
    if (!formData.terms_accepted)
      consentErrors.terms_accepted = "Please accept Terms & Conditions!";
    if (!formData.marketing_consent)
      consentErrors.marketing_consent = "Please accept Marketing Consent!";
    if (!formData.content_consent)
      consentErrors.content_consent = "Please accept Content Usage Consent!";

    if (Object.keys(consentErrors).length > 0) {
      setErrors({ ...errors, ...consentErrors });
      return;
    }
    for (const video of videos) {
      if (video.size > 20 * 1024 * 1024) {
        alert("Each video must be under 20MB!");
        return;
      }
    }
    if (images.length === 0) {
      setErrors({ ...errors, images: "Please upload at least one photo!" });
      return;
    }

    // Form band karo, toast dikhao
    onSubmitStart();

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
      // data.append("category", formData.category);
      data.append("terms_accepted", formData.terms_accepted);
      data.append("marketing_consent", formData.marketing_consent);
      data.append("content_consent", formData.content_consent);
      images.forEach((img) => data.append("images", img));
      videos.forEach((vid) => data.append("videos", vid));

      const response = await fetchWithNgrok(
        `${API_URL}/api/memories/submit-memory`,
        {
          method: "POST",
          body: data,
        },
      );

      const result = await response.json();
      if (result.success) {
        const existing = JSON.parse(localStorage.getItem("myMemories") || "[]");
        existing.push({
          id: result.memory.id,
          name: formData.name,
          city: formData.city,
          state: formData.state,
          year: formData.year || new Date().getFullYear().toString(),
          story_title: formData.story_title,
          description: formData.description,
          image: result.memory.images?.[0] || null,
          video: result.memory.videos?.[0] || null,
        });
        localStorage.setItem("myMemories", JSON.stringify(existing));
        onSubmitSuccess();
      } else {
        alert(result.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-20 rounded-3xl">
            <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mb-3" />
            <p className="text-purple-700 font-semibold text-sm">
              Submitting your memory...
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Please wait, uploading files...
            </p>
          </div>
        )}

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
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length <= 12) {
                          setFormData({ ...formData, mobile: val });
                        }
                      }}
                      placeholder="123456789"
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
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      if (val.length <= 4) {
                        setFormData({ ...formData, year: val });
                      }
                    }}
                    placeholder="e.g. 1995"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
                  />
                  {errors.year && (
                    <p className="text-red-400 text-xs mt-1">{errors.year}</p>
                  )}
                </div>

                {/* <div>
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
                </div> */}

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
                  {errors.images && (
                    <p className="text-red-400 text-xs mt-1">{errors.images}</p>
                  )}

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
                  <label className="flex flex-col gap-1">
                    <div className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="terms_accepted"
                        checked={formData.terms_accepted}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <span className="text-xs text-gray-600">
                        I accept the{" "}
                        <button
                          type="button"
                          onClick={() => setShowTC(true)}
                          className="text-purple-600 underline cursor-pointer font-bold hover:text-purple-800"
                        >
                          Terms & Conditions
                        </button>{" "}
                        *
                      </span>
                    </div>
                    {errors.terms_accepted && (
                      <p className="text-red-400 text-xs ml-5">
                        {errors.terms_accepted}
                      </p>
                    )}
                  </label>

                  <label className="flex flex-col gap-1">
                    <div className="flex items-start gap-2 cursor-pointer">
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
                    </div>
                    {errors.marketing_consent && (
                      <p className="text-red-400 text-xs ml-5">
                        {errors.marketing_consent}
                      </p>
                    )}
                  </label>

                  <label className="flex flex-col gap-1">
                    <div className="flex items-start gap-2 cursor-pointer">
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
                    </div>
                    {errors.content_consent && (
                      <p className="text-red-400 text-xs ml-5">
                        {errors.content_consent}
                      </p>
                    )}
                  </label>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 border-2 border-purple-400 text-purple-600 font-bold py-3 rounded-xl hover:bg-purple-50 disabled:opacity-50"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Memory →"
                    )}
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
        {showTC && <TCModal onClose={() => setShowTC(false)} />}
      </div>
    </div>
  );
};

export default ShareModal;
