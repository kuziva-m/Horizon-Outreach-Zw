import { LayoutDashboard, Users, Settings, LogOut, X } from "lucide-react";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-[#1A4734]/80 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#1A4734] text-[#F9DD9C] border-r-4 border-[#870903] flex flex-col h-screen shadow-[4px_0_0_0_#870903] transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="p-8 border-b-4 border-[#870903] bg-[#143628] flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-[#E90C00] drop-shadow-[2px_2px_0px_#F9DD9C]">
              HORIZON
            </h2>
            <p className="text-xs font-bold tracking-widest text-[#F9DD9C] opacity-80 mt-1 uppercase">
              Outreach Command
            </p>
          </div>
          {/* Close Button (Mobile Only) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#F9DD9C] hover:text-[#E90C00]"
          >
            <X size={28} strokeWidth={3} />
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-4 overflow-y-auto">
          <NavItem
            icon={<LayoutDashboard strokeWidth={3} />}
            label="PIPELINE"
            active
          />
          <NavItem icon={<Users strokeWidth={3} />} label="AGENTS" />
          <NavItem icon={<Settings strokeWidth={3} />} label="CONFIG" />
        </nav>

        <div className="p-6 border-t-4 border-[#870903] bg-[#143628]">
          <button className="flex items-center gap-3 px-4 py-4 w-full font-black uppercase tracking-wider text-[#E90C00] bg-[#F9DD9C] border-4 border-[#E90C00] hover:bg-[#E90C00] hover:text-[#F9DD9C] transition-all active:translate-y-1">
            <LogOut size={24} strokeWidth={3} /> Abort
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-4 px-4 py-4 text-sm font-black uppercase tracking-widest border-2 transition-all
      ${
        active
          ? "bg-[#E90C00] text-[#F9DD9C] border-[#F9DD9C] shadow-[4px_4px_0px_0px_#F9DD9C]"
          : "bg-transparent text-[#F9DD9C] border-[#1A4734] hover:border-[#F9DD9C] hover:bg-[#1A4734]/50"
      }`}
    >
      {icon} {label}
    </a>
  );
}
