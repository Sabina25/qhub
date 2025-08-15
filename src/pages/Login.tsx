// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../auth/AuthContext";

type LocationState = { from?: { pathname?: string } };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const nav = useNavigate();
  const loc = useLocation();
  const from = (loc.state as LocationState)?.from?.pathname || "/admin";

  const { user } = useAuth();

  useEffect(() => {
    if (user) nav("/admin", { replace: true });
  }, [user, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav(from, { replace: true })
    } catch (e: any) {
      setErr(e?.message || "Failed to sign in");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Sign in</button>
      </form>
    </div>
  );
}
