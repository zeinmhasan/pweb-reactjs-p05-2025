// src/pages/GenrePage.tsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import api from "../api";
import Navbar from "../components/Navbar";

interface Genre { id: string; name: string; description?: string; }

export default function GenrePage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editGenre, setEditGenre] = useState<Genre | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGenres = useCallback(async () => {
    try {
      const res = await api.get<{ data: Genre[] }>("/genre");
      setGenres(res.data.data);
    } catch (err: unknown) {
      console.error("Gagal memuat genre:", err);
      setMessage("❌ Gagal memuat genre");
    }
  }, []);

  useEffect(() => { fetchGenres(); }, [fetchGenres]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setMessage("❌ Nama genre wajib diisi");
    setLoading(true); setMessage("");
    try {
      await api.post("/genre", { name, description });
      setMessage("✅ Genre berhasil ditambahkan!");
      setName(""); setDescription(""); fetchGenres();
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) setMessage(err.response?.data?.message || "❌ Gagal menambah genre");
      else if (err instanceof Error) setMessage(err.message);
      else setMessage("❌ Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  const openEditModal = (genre: Genre) => { setEditGenre(genre); setIsModalOpen(true); };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGenre) return;
    setLoading(true); setMessage("");
    try {
      await api.patch(`/genre/${editGenre.id}`, { name: editGenre.name, description: editGenre.description });
      setMessage("✅ Genre berhasil diperbarui!"); setIsModalOpen(false); setEditGenre(null); fetchGenres();
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) setMessage(err.response?.data?.message || "❌ Gagal memperbarui genre");
      else if (err instanceof Error) setMessage(err.message);
      else setMessage("❌ Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  const handleDelete = async (genreId: string) => {
    if (!window.confirm("Yakin ingin menghapus genre ini?")) return;
    setLoading(true); setMessage("");
    try { await api.delete(`/genre/${genreId}`); setMessage("✅ Genre berhasil dihapus!"); fetchGenres(); }
    catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400 && err.response.data?.message) setMessage(`❌ ${err.response.data.message}`);
        else setMessage(err.response?.data?.message || "❌ Gagal menghapus genre");
      } else if (err instanceof Error) setMessage(err.message);
      else setMessage("❌ Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", fontFamily: "'Cinzel', serif", background: "linear-gradient(180deg, #1a1a2b, #2b1a2f)", color: "#fdf6e3", minHeight: "100vh" }}>
        <h1 style={{ textAlign: "center", textShadow: "2px 2px 5px #000" }}>🎨 Daftar Genre</h1>
        {message && <p style={{ textAlign: "center", color: "#ffcc00", textShadow: "1px 1px 2px #000" }}>{message}</p>}

        {/* Tambah Genre */}
        <h3 style={{ marginTop: "1rem", color: "#ffd700" }}>➕ Tambah Genre</h3>
        <form onSubmit={handleAdd} style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
          <input type="text" placeholder="Nama Genre" value={name} onChange={(e) => setName(e.target.value)} required
            style={{ padding: "5px", borderRadius: "5px", border: "none", width: "200px" }} />
          <input type="text" placeholder="Deskripsi (opsional)" value={description} onChange={(e) => setDescription(e.target.value)}
            style={{ padding: "5px", borderRadius: "5px", border: "none", width: "300px" }} />
          <button type="submit" disabled={loading} style={{ padding: "6px 15px", borderRadius: "6px", backgroundColor: "#6a4b9c", color: "#fdf6e3", fontWeight: "bold", boxShadow: "0 0 8px #8e6fc1" }}>
            {loading ? "Processing..." : "Simpan"}
          </button>
        </form>

        {/* List Genre */}
        <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px #000" }}>
          <thead style={{ backgroundColor: "#3b2c4a", color: "#ffd700" }}>
            <tr>
              <th style={{ padding: "8px" }}>ID</th>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((g) => (
              <tr key={g.id} style={{ backgroundColor: "#2b1a2f", color: "#fdf6e3", textAlign: "center" }}>
                <td>{g.id}</td>
                <td>{g.name}</td>
                <td>{g.description || "-"}</td>
                <td>
                  <button onClick={() => openEditModal(g)} style={{ marginRight: "5px", padding: "4px 10px", borderRadius: "5px", backgroundColor: "#ffa500", color: "#fff" }}>Edit</button>
                  <button onClick={() => handleDelete(g.id)} style={{ padding: "4px 10px", borderRadius: "5px", backgroundColor: "#a83232", color: "#fff" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Edit */}
        {isModalOpen && editGenre && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ backgroundColor: "#3b2c4a", padding: "20px", borderRadius: "10px", minWidth: "400px", color: "#fdf6e3", boxShadow: "0 0 15px #8e6fc1" }}>
              <h3 style={{ textAlign: "center", color: "#ffcc00", marginBottom: "15px" }}>✏️ Edit Genre</h3>
              <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input type="text" value={editGenre.name} onChange={(e) => setEditGenre({ ...editGenre, name: e.target.value })} required
                  style={{ padding: "5px", borderRadius: "5px", border: "none" }} />
                <input type="text" value={editGenre.description || ""} onChange={(e) => setEditGenre({ ...editGenre, description: e.target.value })}
                  style={{ padding: "5px", borderRadius: "5px", border: "none" }} />
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                  <button type="submit" style={{ marginRight: "10px", padding: "6px 15px", borderRadius: "6px", backgroundColor: "#ffa500", color: "#fff", fontWeight: "bold" }}>Update</button>
                  <button type="button" onClick={() => { setIsModalOpen(false); setEditGenre(null); }} style={{ padding: "6px 15px", borderRadius: "6px", backgroundColor: "#a83232", color: "#fff", fontWeight: "bold" }}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
