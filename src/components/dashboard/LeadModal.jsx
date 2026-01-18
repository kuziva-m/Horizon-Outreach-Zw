import { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Plus,
  Trash2,
  Loader2,
  Clipboard,
  Sparkles,
  Save,
  UploadCloud,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LeadModal({
  isOpen,
  onClose,
  editingId,
  initialData,
  countryFilter,
  refreshData,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    industry: "Poultry",
    custom_industry: "",
    website: "",
    contacts: [{ type: "WhatsApp", value: "" }],
    evidence: [],
    revamp_images: [],
    notes: "",
  });

  useEffect(() => {
    if (editingId && initialData) {
      const standardIndustries = [
        "Poultry",
        "Construction",
        "Finance",
        "Food",
        "Tourism",
      ];
      const isStandard = standardIndustries.includes(initialData.industry);
      setFormData({
        business_name: initialData.business_name || "",
        industry: isStandard ? initialData.industry : "Other",
        custom_industry: isStandard ? "" : initialData.industry,
        website: initialData.website || "",
        contacts: initialData.contacts || [
          { type: "WhatsApp", value: initialData.phone || "" },
        ],
        evidence: initialData.evidence || [],
        revamp_images: initialData.revamp_images || [],
        notes: initialData.notes || "",
      });
      setShowCustomIndustry(!isStandard);
    } else {
      setFormData({
        business_name: "",
        industry: "Poultry",
        custom_industry: "",
        website: "",
        contacts: [{ type: "WhatsApp", value: "" }],
        evidence: [],
        revamp_images: [],
        notes: "",
      });
      setShowCustomIndustry(false);
    }
  }, [editingId, initialData, isOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    const finalIndustry =
      formData.industry === "Other"
        ? formData.custom_industry
        : formData.industry;
    let cleanWebsite = formData.website;
    if (cleanWebsite && !cleanWebsite.startsWith("http"))
      cleanWebsite = "https://" + cleanWebsite;

    const payload = {
      business_name: formData.business_name,
      industry: finalIndustry,
      country: countryFilter,
      contacts: formData.contacts,
      website: cleanWebsite,
      phone: formData.contacts[0]?.value || "",
      evidence: formData.evidence,
      revamp_images: formData.revamp_images,
      notes: formData.notes,
    };

    const { error } = editingId
      ? await supabase.from("leads").update(payload).eq("id", editingId)
      : await supabase.from("leads").insert([{ ...payload, status: "new" }]);

    if (!error) {
      refreshData();
      onClose();
    } else {
      alert(error.message);
    }
  };

  // Generic Upload (Handles both Evidence and Revamp)
  const processFileUpload = async (file, fieldTarget) => {
    if (!file || !file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${Math.random()}.${fileExt}`;
      await supabase.storage.from("evidence").upload(filePath, file);
      const {
        data: { publicUrl },
      } = supabase.storage.from("evidence").getPublicUrl(filePath);
      setFormData((prev) => ({
        ...prev,
        [fieldTarget]: [...prev[fieldTarget], publicUrl],
      }));
    } catch (e) {
      alert("Upload failed: " + e.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#1A4734]/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-[#F9DD9C] border-4 border-[#870903] shadow-[10px_10px_0px_0px_#000] w-full max-w-2xl flex flex-col my-10">
        {/* Header */}
        <div className="p-4 border-b-4 border-[#870903] bg-[#E90C00] flex justify-between items-center">
          <h2 className="text-xl font-black text-[#F9DD9C] uppercase tracking-tighter">
            {editingId ? "Modify Target" : "New Target"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#F9DD9C] hover:text-white transition-colors bg-black/20 p-2"
          >
            <X size={24} strokeWidth={4} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-[#FFF8E7]">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Identity & Contacts (Simplified for brevity) */}
            <div className="bg-white p-4 border-4 border-[#1A4734]">
              <h3 className="font-black text-[#1A4734] uppercase tracking-widest text-xs mb-3">
                Target Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  value={formData.business_name}
                  onChange={(e) =>
                    setFormData({ ...formData, business_name: e.target.value })
                  }
                  placeholder="Business Name"
                  className="p-3 border-2 border-[#1A4734] font-bold focus:bg-[#E90C00]/10 outline-none w-full"
                />
                <input
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="Website"
                  className="p-3 border-2 border-[#1A4734] font-bold focus:bg-[#E90C00]/10 outline-none w-full"
                />
                <div className="col-span-1 md:col-span-2 space-y-2">
                  {formData.contacts.map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={c.value}
                        onChange={(e) => {
                          const n = [...formData.contacts];
                          n[i].value = e.target.value;
                          setFormData({ ...formData, contacts: n });
                        }}
                        placeholder="Phone / Email"
                        className="flex-1 p-3 border-2 border-[#1A4734] font-bold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            contacts: formData.contacts.filter(
                              (_, idx) => idx !== i,
                            ),
                          })
                        }
                        className="p-3 bg-red-100 text-red-600 border-2 border-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        contacts: [
                          ...formData.contacts,
                          { type: "WhatsApp", value: "" },
                        ],
                      })
                    }
                    className="text-xs font-black uppercase text-[#1A4734] hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Contact
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-[#FFF5F5] p-4 border-4 border-[#E90C00]">
              <h3 className="font-black text-[#E90C00] uppercase tracking-widest text-xs mb-2">
                Mission Notes
              </h3>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Analysis / Strategy..."
                className="w-full h-24 bg-transparent border-none font-bold text-[#870903] resize-none focus:outline-none"
              />
            </div>

            {/* --- IMAGES SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 🔴 BEFORE (EVIDENCE) */}
              <div
                className="p-4 border-4 border-dashed border-[#870903] bg-white relative"
                onPaste={(e) => {
                  const item = e.clipboardData.items[0];
                  if (item.type.indexOf("image") !== -1)
                    processFileUpload(item.getAsFile(), "evidence");
                }}
              >
                <div className="absolute -top-3 left-4 bg-[#870903] text-[#F9DD9C] px-2 font-black text-xs uppercase">
                  Evidence (Before)
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.evidence.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square border-2 border-[#870903] group"
                    >
                      <img
                        src={url}
                        className="w-full h-full object-cover grayscale"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            evidence: formData.evidence.filter(
                              (_, idx) => idx !== i,
                            ),
                          })
                        }
                        className="absolute inset-0 bg-[#E90C00]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                  {/* Upload Button */}
                  <label className="aspect-square border-2 border-[#870903] border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-[#E90C00]/10 transition-colors">
                    {isUploading ? (
                      <Loader2 className="animate-spin text-[#870903]" />
                    ) : (
                      <Clipboard className="text-[#870903]" />
                    )}
                    <span className="text-[10px] font-black text-[#870903] uppercase mt-1">
                      Paste (Ctrl+V)
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        processFileUpload(e.target.files[0], "evidence")
                      }
                    />
                  </label>
                </div>
              </div>

              {/* 🟢 AFTER (REVAMP) */}
              <div
                className="p-4 border-4 border-dashed border-[#1A4734] bg-white relative"
                onPaste={(e) => {
                  const item = e.clipboardData.items[0];
                  if (item.type.indexOf("image") !== -1)
                    processFileUpload(item.getAsFile(), "revamp_images");
                }}
              >
                <div className="absolute -top-3 left-4 bg-[#1A4734] text-[#F9DD9C] px-2 font-black text-xs uppercase">
                  Revamp (After)
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  {formData.revamp_images.map((url, i) => (
                    <div
                      key={i}
                      className="relative aspect-square border-2 border-[#1A4734] group"
                    >
                      <img src={url} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            revamp_images: formData.revamp_images.filter(
                              (_, idx) => idx !== i,
                            ),
                          })
                        }
                        className="absolute inset-0 bg-[#E90C00]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                  {/* Upload Button */}
                  <label className="aspect-square border-2 border-[#1A4734] border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-[#1A4734]/10 transition-colors">
                    {isUploading ? (
                      <Loader2 className="animate-spin text-[#1A4734]" />
                    ) : (
                      <Sparkles className="text-[#1A4734]" />
                    )}
                    <span className="text-[10px] font-black text-[#1A4734] uppercase mt-1">
                      Paste (Ctrl+V)
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        processFileUpload(e.target.files[0], "revamp_images")
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1A4734] text-[#F9DD9C] font-black uppercase text-xl border-4 border-[#1A4734] hover:bg-[#F9DD9C] hover:text-[#1A4734] transition-all flex justify-center items-center gap-3 shadow-[4px_4px_0_0_#1A4734] active:translate-y-1 active:shadow-none"
            >
              <Save size={24} strokeWidth={3} /> Save Data
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
