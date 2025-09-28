import { useState } from "react";
import { forgotPassword } from "../api/auth";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      setMsg("Password reset link sent to your email!");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error sending reset link");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <p className="msg">{msg}</p>
      <p>
        Back to <a href="/login">Login</a>
      </p>
    </div>
  );
}
