import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Phone, CheckCircle, XCircle, Globe, Plus, Search } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    industry: "Poultry",
  });
  const [showModal, setShowModal] = useState(false);

  // Real-time listener for leads
  useEffect(() => {
    const q = query(collection(db, "leads"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let leadsData = [];
      snapshot.forEach((doc) => {
        leadsData.push({ ...doc.data(), id: doc.id });
      });
      // Sort: Newest first
      setLeads(leadsData.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Function to add a lead (Manual Scraper Style)
  const handleAddLead = async (e) => {
    e.preventDefault();
    if (!newLead.name || !newLead.phone) return;

    await addDoc(collection(db, "leads"), {
      ...newLead,
      status: "new", // new, contacted, warm, closed
      createdAt: new Date(),
      country: "Zimbabwe", // Default to Zim for now
    });
    setNewLead({ name: "", phone: "", industry: "Poultry" });
    setShowModal(false);
  };

  // Function to mark status
  const updateStatus = async (id, status) => {
    const leadRef = doc(db, "leads", id);
    await updateDoc(leadRef, { status: status });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales Pipeline</h1>
            <p className="text-gray-500">Manual Outreach Tracker</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <Plus size={20} /> Add Lead
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm">Leads Today</h3>
            <p className="text-3xl font-bold text-black">{leads.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm">Contacted</h3>
            <p className="text-3xl font-bold text-blue-600">
              {leads.filter((l) => l.status === "contacted").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm">Closed ($)</h3>
            <p className="text-3xl font-bold text-green-600">
              {leads.filter((l) => l.status === "closed").length}
            </p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                  Business
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                  Industry
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                  Action
                </th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="p-4 text-gray-500">{lead.industry}</td>
                  <td className="p-4">
                    {/* THE MONEY BUTTON */}
                    <a
                      href={`https://wa.me/${lead.phone.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      onClick={() => updateStatus(lead.id, "contacted")}
                      className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-600"
                    >
                      <Phone size={16} /> WhatsApp
                    </a>
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className={`text-xs font-bold uppercase px-2 py-1 rounded border-none outline-none cursor-pointer
                        ${
                          lead.status === "new"
                            ? "bg-gray-100 text-gray-600"
                            : ""
                        }
                        ${
                          lead.status === "contacted"
                            ? "bg-blue-100 text-blue-600"
                            : ""
                        }
                        ${
                          lead.status === "closed"
                            ? "bg-green-100 text-green-600"
                            : ""
                        }
                      `}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="warm">Warm</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Simple Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
            <form onSubmit={handleAddLead} className="space-y-4">
              <input
                placeholder="Business Name (e.g. Tension Corner)"
                className="w-full p-2 border rounded"
                value={newLead.name}
                onChange={(e) =>
                  setNewLead({ ...newLead, name: e.target.value })
                }
              />
              <input
                placeholder="Phone (e.g. 26377...)"
                className="w-full p-2 border rounded"
                value={newLead.phone}
                onChange={(e) =>
                  setNewLead({ ...newLead, phone: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={newLead.industry}
                onChange={(e) =>
                  setNewLead({ ...newLead, industry: e.target.value })
                }
              >
                <option value="Poultry">Poultry</option>
                <option value="Construction">Construction</option>
                <option value="Finance">Finance</option>
                <option value="Tourism">Tourism</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
