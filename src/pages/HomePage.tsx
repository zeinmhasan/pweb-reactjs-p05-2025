// src/pages/HomePage.tsx
import Navbar from "../components/Navbar";

function HomePage() {
  const containerStyle: React.CSSProperties = {
    padding: "3rem",
    backgroundColor: "#1a1b26", // gelap elegan
    fontFamily: "'Cinzel', serif",
    color: "#fdf6e3",
    minHeight: "100vh",
    textShadow: "1px 1px 3px #000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: "12px",
    padding: "2rem 3rem",
    boxShadow: "0 0 20px rgba(127, 90, 240, 0.4)",
    textAlign: "center",
    maxWidth: "600px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "#7f5af0",
  };

  const textStyle: React.CSSProperties = {
    fontSize: "1.1rem",
    lineHeight: "1.6",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "1.5rem",
    backgroundColor: "#7f5af0",
    color: "#fff",
    border: "none",
    padding: "0.7rem 1.5rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "0.3s",
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>📚 BookStore Dashboard</h1>
          <p style={textStyle}>
            Selamat datang di sistem manajemen buku!  
            Di sini kamu dapat menelusuri, menambah, dan mengatur koleksi buku serta transaksi pembelian.
          </p>
          <button
            style={buttonStyle}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#a78bfa")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#7f5af0")
            }
          >
            Mulai Jelajahi Buku
          </button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
