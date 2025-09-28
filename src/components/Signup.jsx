import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      setMsg("Signup successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Full Name" onChange={handleChange} />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className="msg">{msg}</p>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
