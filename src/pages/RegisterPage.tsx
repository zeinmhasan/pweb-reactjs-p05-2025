// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { isAxiosError } from "axios";

interface RegisterResponse {
  message: string;
  data: {
    id: string;
    email: string;
    username: string;
    created_at: string;
    updated_at: string;
  };
}

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post<RegisterResponse>("/auth/register", {
        username,
        email,
        password,
      });

      setMessage(res.data.message);
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setMessage(err.response?.data?.message || "❌ Gagal registrasi");
      } else if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("❌ Terjadi kesalahan");
      }
    }
  };

  // ==========================
  // STYLE SENADA DENGAN LOGINPAGE
  // ==========================
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#1a1b26", // tema gelap elegan
    fontFamily: "'Cinzel', serif",
    color: "#fdf6e3",
    textShadow: "1px 1px 4px #000",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: "2.5rem 3rem",
    borderRadius: "12px",
    boxShadow: "0 0 25px rgba(127, 90, 240, 0.4)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  };

  const inputStyle: React.CSSProperties = {
    marginBottom: "1rem",
    padding: "0.8rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.8rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#7f5af0",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    width: "100%",
    transition: "0.3s",
    marginTop: "0.5rem",
  };

  const linkStyle: React.CSSProperties = {
    color: "#ffdf00",
    cursor: "pointer",
    textDecoration: "underline",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#7f5af0",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>📚 Daftar ke BookStore</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#a78bfa")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#7f5af0")
            }
          >
            Daftar
          </button>
        </form>

        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

        <p style={{ marginTop: "1rem" }}>
          Sudah punya akun?{" "}
          <span style={linkStyle} onClick={() => navigate("/login")}>
            Masuk di sini
          </span>
        </p>
      </div>
    </div>
  );
}
