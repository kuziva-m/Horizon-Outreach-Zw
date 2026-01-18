import { useState } from "react";
import {
  Phone,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  FileText,
  AlertTriangle,
  Sparkles,
  Trash2,
  Download,
  ExternalLink,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function LeadRow({ lead, onEdit, refreshData }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status) => {
    // SECURITY CHECK: Revamped requires images
    if (status === "revamped") {
      const hasImages = lead.revamp_images && lead.revamp_images.length > 0;
      if (!hasImages) {
        alert(
          "⛔ ACTION DENIED\n\nYou cannot mark a lead as 'Revamped' until you upload 'After' screenshots.\n\n1. Click 'Edit'\n2. Scroll to 'Revamp Showcase'\n3. Paste/Upload your work\n4. Save",
        );
        return;
      }
    }

    setLoading(true);
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", lead.id);
    setLoading(false);

    if (error) {
      alert("Database Error: " + error.message);
    } else {
      refreshData();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) alert(error.message);
    else refreshData();
  };

  const openImage = (url) => {
    window.open(url, "_blank");
  };

  const getStatusColor = (s) => {
    switch (s) {
      case "new":
        return "bg-white text-[#870903] border-[#870903]";
      case "contacted":
        return "bg-[#1A4734] text-[#F9DD9C] border-[#1A4734]";
      case "warm":
        return "bg-[#F9DD9C] text-[#870903] border-[#870903]";
      case "closed":
        return "bg-[#E90C00] text-white border-[#E90C00]";
      case "revamped":
        return "bg-[#418B24] text-white border-[#418B24] shadow-[0_0_10px_#418B24]"; // Glowing Green
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div
      className={`bg-white border-4 border-[#1A4734] transition-all ${expanded ? "shadow-[8px_8px_0px_0px_#1A4734] -translate-y-1" : "hover:shadow-[4px_4px_0px_0px_#1A4734]"}`}
    >
      {/* HEADER */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-[#1A4734] uppercase">
              {lead.business_name}
            </h3>
            {/* Visual Indicators */}
            {lead.notes && (
              <FileText size={16} className="text-[#E90C00]" strokeWidth={3} />
            )}
            {lead.evidence?.length > 0 && (
              <AlertTriangle
                size={16}
                className="text-[#E90C00]"
                strokeWidth={3}
              />
            )}
            {lead.revamp_images?.length > 0 && (
              <Sparkles size={16} className="text-[#418B24]" strokeWidth={3} />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-1 text-xs font-bold text-[#870903] uppercase">
            <span className="opacity-75">{lead.industry}</span>
            {lead.website ? (
              <a
                href={lead.website}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-[#E90C00] hover:underline underline-offset-2"
              >
                <LinkIcon size={12} /> VISIT SITE
              </a>
            ) : (
              <span className="opacity-50 line-through">NO SITE</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between">
          <div
            className={`px-4 py-2 border-2 text-xs font-black uppercase tracking-widest ${getStatusColor(lead.status)}`}
          >
            {loading ? "Saving..." : lead.status}
          </div>
          <div className="text-[#1A4734]">
            {expanded ? (
              <ChevronUp strokeWidth={4} />
            ) : (
              <ChevronDown strokeWidth={4} />
            )}
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <div className="border-t-4 border-[#1A4734] bg-[#F9DD9C]/20 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2">
          {/* LEFT: ACTIONS */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <a
                href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                className="flex-1 bg-[#418B24] text-white py-3 border-2 border-[#1A4734] font-black uppercase flex items-center justify-center gap-2 hover:bg-[#1A4734] transition-colors shadow-[4px_4px_0px_0px_#1A4734] active:shadow-none active:translate-y-1"
              >
                <Phone size={18} strokeWidth={3} /> WhatsApp
              </a>
              <button
                onClick={onEdit}
                className="px-6 py-3 bg-white border-2 border-[#1A4734] text-[#1A4734] font-black uppercase hover:bg-[#1A4734] hover:text-white transition-colors"
              >
                Edit
              </button>
            </div>
            <div className="space-y-2">
              {lead.contacts?.map((c, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white p-2 border-2 border-[#1A4734]/20 text-sm font-bold text-[#1A4734]"
                >
                  <span className="opacity-50 uppercase text-xs">{c.type}</span>
                  <span className="font-mono break-all">{c.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleDelete}
              className="w-full py-2 bg-red-100 border-2 border-red-500 text-red-600 font-bold uppercase hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
            >
              <Trash2 size={16} /> Delete Target
            </button>
          </div>

          {/* RIGHT: PIPELINE CONTROLS */}
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {["new", "contacted", "warm", "closed"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`px-3 py-1 border-2 font-bold text-xs uppercase transition-all ${lead.status === s ? "bg-[#1A4734] text-white border-[#1A4734]" : "bg-white text-[#1A4734] border-[#1A4734] hover:bg-[#1A4734]/10"}`}
                >
                  {s}
                </button>
              ))}
              {/* REVAMPED BUTTON (Special Styling) */}
              <button
                onClick={() => updateStatus("revamped")}
                className={`px-3 py-1 border-2 font-bold text-xs uppercase transition-all flex items-center gap-1 ${lead.status === "revamped" ? "bg-[#418B24] text-white border-[#418B24]" : "bg-white text-[#418B24] border-[#418B24] hover:bg-[#418B24] hover:text-white"}`}
              >
                <Sparkles size={12} /> Revamped
              </button>
            </div>

            {lead.notes && (
              <div className="bg-[#FFF5F5] border-l-4 border-[#E90C00] p-3 text-sm font-bold text-[#870903] font-mono leading-tight">
                "{lead.notes}"
              </div>
            )}

            {/* IMAGE GALLERIES */}
            {(lead.evidence?.length > 0 || lead.revamp_images?.length > 0) && (
              <div className="space-y-3 pt-2 border-t-2 border-[#1A4734]/10">
                {/* BEFORE */}
                {lead.evidence?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#870903] mb-1">
                      Evidence (Before)
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {lead.evidence.map((src, i) => (
                        <div
                          key={i}
                          className="relative w-12 h-12 border-2 border-[#870903] group bg-white cursor-pointer"
                          onClick={() => openImage(src)}
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover grayscale hover:grayscale-0"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <ExternalLink
                              size={12}
                              className="text-white opacity-0 group-hover:opacity-100"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AFTER */}
                {lead.revamp_images?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#418B24] mb-1">
                      Revamp (After)
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {lead.revamp_images.map((src, i) => (
                        <div
                          key={i}
                          className="relative w-12 h-12 border-2 border-[#418B24] group bg-white cursor-pointer"
                          onClick={() => openImage(src)}
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <ExternalLink
                              size={12}
                              className="text-white opacity-0 group-hover:opacity-100"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
