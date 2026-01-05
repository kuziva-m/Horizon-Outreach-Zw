import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-black tracking-tighter">AGENCY CRM</h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-black rounded-lg font-medium"
        >
          <LayoutDashboard size={20} /> Dashboard
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium"
        >
          <Users size={20} /> My Team
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg font-medium"
        >
          <Settings size={20} /> Settings
        </a>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 w-full hover:bg-red-50 rounded-lg font-medium">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
