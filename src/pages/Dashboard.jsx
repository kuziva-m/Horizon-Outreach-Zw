import { useState, useEffect, useMemo } from "react";
import { Plus, Globe, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatBox from "../components/dashboard/StatBox";
import LeadRow from "../components/dashboard/LeadRow";
import LeadModal from "../components/dashboard/LeadModal";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [countryFilter, setCountryFilter] = useState("Zimbabwe");
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    fetchLeads();
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => fetchLeads(),
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchLeads() {
    // 1. Get data sorted by date first
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      // 2. Custom Sort: Force 'revamped' to the top
      const sortedData = data.sort((a, b) => {
        if (a.status === "revamped" && b.status !== "revamped") return -1;
        if (a.status !== "revamped" && b.status === "revamped") return 1;
        return 0; // Keep original date sorting for the rest
      });
      setLeads(sortedData);
    }
  }

  // --- Stats & Filtering ---
  const stats = useMemo(() => {
    const total = leads.length;
    const contacted = leads.filter((l) => l.status === "contacted").length;
    // Count 'revamped' as closed/success for stats if you want, or keep separate
    const closed = leads.filter(
      (l) => l.status === "closed" || l.status === "revamped",
    ).length;
    return { total, contacted, closed };
  }, [leads]);

  const filteredLeads = leads.filter((l) => {
    const matchesCountry = l.country === countryFilter;
    const matchesSearch =
      l.business_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.industry?.toLowerCase().includes(search.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F9DD9C] text-[#870903] font-mono overflow-hidden">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      <main className="flex-1 overflow-y-auto bg-[#F9DD9C] relative">
        <div className="p-6 md:p-10 pb-24">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b-4 border-[#870903] pb-6 gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                className="md:hidden p-2 border-4 border-[#870903] text-[#870903] bg-white active:bg-[#870903] active:text-[#F9DD9C]"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} strokeWidth={3} />
              </button>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-[#870903] uppercase tracking-tighter leading-none">
                  TARGET LIST
                </h1>
                <p className="text-[#1A4734] font-bold text-xs md:text-sm mt-2 uppercase tracking-widest bg-[#418B24]/20 inline-block px-2">
                  Sector: {countryFilter}
                </p>
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() =>
                  setCountryFilter(
                    countryFilter === "Zimbabwe" ? "Canada" : "Zimbabwe",
                  )
                }
                className="h-12 px-6 bg-white border-4 border-[#1A4734] text-[#1A4734] font-black uppercase hover:bg-[#1A4734] hover:text-[#F9DD9C] transition-all shadow-[4px_4px_0px_0px_#1A4734] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 flex-1 md:flex-none"
              >
                <Globe size={20} strokeWidth={3} /> {countryFilter}
              </button>
              <button
                onClick={handleOpenAdd}
                className="h-12 px-6 bg-[#E90C00] text-white border-4 border-[#870903] font-black uppercase hover:bg-[#870903] transition-all shadow-[4px_4px_0px_0px_#870903] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 flex-1 md:flex-none"
              >
                <Plus size={20} strokeWidth={3} /> New Target
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
            <StatBox
              label="DETECTED"
              value={stats.total}
              color="text-[#870903]"
              border="border-[#870903]"
            />
            <StatBox
              label="ENGAGED"
              value={stats.contacted}
              color="text-[#1A4734]"
              border="border-[#1A4734]"
            />
            <StatBox
              label="CLOSED"
              value={stats.closed}
              color="text-[#E90C00]"
              border="border-[#E90C00]"
            />
          </div>

          {/* SEARCH */}
          <div className="mb-6">
            <input
              placeholder="SEARCH DATABASE..."
              className="w-full bg-white border-4 border-[#870903] p-4 font-bold text-[#870903] placeholder-[#870903]/50 focus:outline-none focus:bg-[#FFF8E7] shadow-[4px_4px_0px_0px_#870903]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* LIST */}
          <div className="flex flex-col gap-4">
            {filteredLeads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                onEdit={() => handleOpenEdit(lead)}
                refreshData={fetchLeads}
              />
            ))}
            {filteredLeads.length === 0 && (
              <div className="text-center py-20 border-4 border-dashed border-[#870903]/30 font-bold text-[#870903]/50 uppercase">
                No targets found.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={editingLead?.id}
        initialData={editingLead}
        countryFilter={countryFilter}
        refreshData={fetchLeads}
      />
    </div>
  );
}
