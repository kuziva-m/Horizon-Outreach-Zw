import { useState } from "react";
import { supabase } from "../lib/supabase";
import { LogIn, ShieldAlert } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
  };

  return (
    <div className="h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-8 border-brand-dark rounded-3xl p-10 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-brand-dark uppercase tracking-tighter">
            Horizon <span className="text-brand-red">Auth</span>
          </h1>
          <p className="text-brand-light font-bold uppercase text-xs tracking-widest mt-2">
            Authorized Personnel Only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-4 border-4 border-brand-dark rounded-2xl font-bold focus:border-brand-red outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full p-4 border-4 border-brand-dark rounded-2xl font-bold focus:border-brand-red outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="bg-red-100 text-brand-red p-3 rounded-xl flex items-center gap-2 font-bold text-sm">
              <ShieldAlert size={18} /> {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-brand-red text-white font-black text-xl py-4 rounded-2xl shadow-[0_6px_0_0_#0D6628] hover:translate-y-1 hover:shadow-none transition-all uppercase flex items-center justify-center gap-2"
          >
            <LogIn size={24} /> Secure Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
