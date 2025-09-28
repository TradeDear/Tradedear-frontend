import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);

      // 
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      setMsg(`Welcome, ${res.user.name}`);

      // 
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="msg">{msg}</p>
      <p>
        Forgot password? <a href="/forgot-password">Reset</a>
      </p>
      <p>
        New here? <a href="/signup">Create an account</a>
      </p>
    </div>
  );
}
