import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="h-screen bg-brand-cream flex items-center justify-center font-black text-brand-dark uppercase">
        Loading System...
      </div>
    );

  return <div className="App">{!session ? <Login /> : <Dashboard />}</div>;
}

export default App;
