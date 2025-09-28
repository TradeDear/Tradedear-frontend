import { useEffect, useState } from "react";
import { getProfile, logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        setMsg("⚠️ Please login first.");
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setMsg("✅ Logged out successfully.");
    navigate("/login");
  };

  if (!user) return <p>{msg || "Loading profile..."}</p>;

  return (
    <div className="form-container">
      <h2>Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
