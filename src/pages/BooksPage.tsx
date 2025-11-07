// src/pages/BooksPage.tsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "../api";
import Navbar from "../components/Navbar";

interface Genre { id: string; name: string; }
interface Book {
  id: string;
  title: string;
  writer: string;
  publisher: string;
  publication_year: number;
  description?: string;
  price: number;
  stock_quantity: number;
  genre_id: string;
  genre: Genre;
}
interface Filters {
  q?: string;
  genre_id?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  yearFrom?: number;
  yearTo?: number;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "", writer: "", publisher: "", publication_year: "", description: "",
    price: "", stock_quantity: "", genre_id: ""
  });
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({});

  const fetchBooks = useCallback(async () => {
    setLoading(true); setMessage("");
    try {
      const params: Record<string, string | number | boolean> = {};
      if (filters.q) params.q = filters.q;
      if (filters.genre_id) params.genre_id = filters.genre_id;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.inStock) params.inStock = true;
      if (filters.yearFrom !== undefined) params.yearFrom = filters.yearFrom;
      if (filters.yearTo !== undefined) params.yearTo = filters.yearTo;

      const res = await api.get<{ data: Book[] }>("/books", { params });
      setBooks(res.data.data);
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) setMessage(err.response?.data?.message || "❌ Gagal memuat buku");
      else if (err instanceof Error) setMessage(err.message);
      else setMessage("❌ Terjadi kesalahan");
    } finally { setLoading(false); }
  }, [filters]);

  const fetchGenres = useCallback(async () => {
    try {
      const res = await api.get<{ data: Genre[] }>("/genre");
      setGenres(res.data.data);
    } catch (err: unknown) {
      console.error(err);
      setMessage("❌ Gagal memuat genre");
    }
  }, []);

  useEffect(() => { fetchBooks(); fetchGenres(); }, [fetchBooks, fetchGenres]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setMessage("");
    const payload = {
      title: form.title,
      writer: form.writer,
      publisher: form.publisher,
      publication_year: Number(form.publication_year),
      description: form.description,
      price: Number(form.price),
      stock_quantity: Number(form.stock_quantity),
      genre_id: form.genre_id,
    };
    try {
      if (editBook) {
  await api.patch(`/books/${editBook.id}`, payload);
  setMessage("✅ Buku berhasil diperbarui!");
  setEditBook(null);
} else {
  await api.post("/books", payload);
  setMessage("✅ Buku berhasil ditambahkan!");
}

      setForm({ title: "", writer: "", publisher: "", publication_year: "", description: "", price: "", stock_quantity: "", genre_id: "" });
      setIsModalOpen(false); fetchBooks();
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) setMessage(err.response?.data?.message || "❌ Gagal menyimpan buku");
      else if (err instanceof Error) setMessage(err.message);
      else setMessage("❌ Terjadi kesalahan");
    } finally { setLoading(false); }
  };

  const openEditModal = (book: Book) => {
    setEditBook(book);
    setForm({
      title: book.title, writer: book.writer, publisher: book.publisher,
      publication_year: String(book.publication_year),
      description: book.description || "", price: String(book.price),
      stock_quantity: String(book.stock_quantity), genre_id: book.genre_id
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (bookId: string) => {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
    setLoading(true); setMessage("");
    try { await api.delete(`/books/${bookId}`); setMessage("✅ Buku berhasil dihapus"); fetchBooks(); }
    catch (err: unknown) { console.error(err); setMessage("❌ Gagal menghapus buku"); }
    finally { setLoading(false); }
  };

  // ===== Style =====
  const containerStyle: React.CSSProperties = {
    padding: "2rem", fontFamily: "'Cinzel', serif", color: "#fdf6e3",
    minHeight: "100vh", backgroundColor: "#1a1a2b", textShadow: "1px 1px 2px #000"
  };
  const filterStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem", backgroundColor: "#2b1a2f", padding: "1rem", borderRadius: "10px" };
  const inputStyle: React.CSSProperties = { padding: "0.5rem", borderRadius: "6px", border: "none", outline: "none", backgroundColor: "#3b2c4a", color: "#fdf6e3" };
  const buttonStyle: React.CSSProperties = { padding: "0.5rem 1rem", borderRadius: "6px", border: "none", backgroundColor: "#7f5af0", color: "#fff", cursor: "pointer", transition: "0.3s" };
  const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginTop: "1rem", backgroundColor: "#2b1a2f", borderRadius: "8px", overflow: "hidden" };
  const thStyle: React.CSSProperties = { padding: "8px", textAlign: "left", backgroundColor: "#7f5af0", color: "#ffd700" };
  const tdStyle: React.CSSProperties = { padding: "8px", borderBottom: "1px solid #3b2c4a" };
  const modalStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center" };
  const modalContentStyle: React.CSSProperties = { backgroundColor: "#3b2c4a", color: "#fdf6e3", padding: "20px", borderRadius: "12px", minWidth: "400px", boxShadow: "0 0 20px #000" };
  const modalInputStyle: React.CSSProperties = { display: "block", width: "100%", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "6px", border: "none", backgroundColor: "#2b1a2f", color: "#fdf6e3" };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>📚 Perpustakaan Sihir</h1>

        {/* Filter */}
        <div style={filterStyle}>
          <input style={inputStyle} type="text" placeholder="Cari judul, penulis, penerbit..." value={filters.q || ""} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
          <select style={inputStyle} value={filters.genre_id || ""} onChange={(e) => setFilters({ ...filters, genre_id: e.target.value })}>
            <option value="">-- Semua Genre --</option>
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <input style={inputStyle} type="number" placeholder="Harga min" value={filters.minPrice || ""} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })} />
          <input style={inputStyle} type="number" placeholder="Harga max" value={filters.maxPrice || ""} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })} />
          <input style={inputStyle} type="number" placeholder="Tahun dari" value={filters.yearFrom || ""} onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value ? Number(e.target.value) : undefined })} />
          <input style={inputStyle} type="number" placeholder="Tahun sampai" value={filters.yearTo || ""} onChange={(e) => setFilters({ ...filters, yearTo: e.target.value ? Number(e.target.value) : undefined })} />
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input type="checkbox" checked={filters.inStock || false} onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })} /> Hanya tersedia
          </label>
          <button style={buttonStyle} onClick={fetchBooks}>🔍 Filter</button>
          <button style={buttonStyle} onClick={() => setFilters({})}>Reset</button>
        </div>

        {message && <p style={{ color: "#ffcc00", textAlign: "center" }}>{message}</p>}

        <button style={{ ...buttonStyle, marginBottom: "10px" }} onClick={() => setIsModalOpen(true)}>➕ Tambah Buku</button>

        {/* Tabel Buku */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Judul</th><th style={thStyle}>Penulis</th><th style={thStyle}>Penerbit</th>
              <th style={thStyle}>Tahun</th><th style={thStyle}>Genre</th><th style={thStyle}>Harga</th>
              <th style={thStyle}>Stok</th><th style={thStyle}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id}>
                <td style={tdStyle}>{b.title}</td><td style={tdStyle}>{b.writer}</td>
                <td style={tdStyle}>{b.publisher}</td><td style={tdStyle}>{b.publication_year}</td>
                <td style={tdStyle}>{b.genre.name}</td><td style={tdStyle}>{b.price}</td>
                <td style={tdStyle}>{b.stock_quantity}</td>
                <td style={tdStyle}>
                  <button style={{ ...buttonStyle, backgroundColor: "#ff9800", marginRight: "5px" }} onClick={() => openEditModal(b)}>Edit</button>
                  <button style={{ ...buttonStyle, backgroundColor: "#e53935" }} onClick={() => handleDelete(b.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal Tambah/Edit */}
        {isModalOpen && (
          <div style={modalStyle}>
            <div style={modalContentStyle}>
              <h3 style={{ marginBottom: "10px" }}>{editBook ? "✏️ Edit Buku" : "➕ Tambah Buku"}</h3>
              <form onSubmit={handleSubmit}>
                <input style={modalInputStyle} placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                <input style={modalInputStyle} placeholder="Penulis" value={form.writer} onChange={(e) => setForm({ ...form, writer: e.target.value })} required />
                <input style={modalInputStyle} placeholder="Penerbit" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} required />
                <input style={modalInputStyle} type="number" placeholder="Tahun" value={form.publication_year} onChange={(e) => setForm({ ...form, publication_year: e.target.value })} required />
                <input style={modalInputStyle} placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <input style={modalInputStyle} type="number" placeholder="Harga" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input style={modalInputStyle} type="number" placeholder="Stok" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                <select style={modalInputStyle} value={form.genre_id} onChange={(e) => setForm({ ...form, genre_id: e.target.value })} required>
                  <option value="">-- Pilih Genre --</option>
                  {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
                <div style={{ marginTop: "10px" }}>
                  <button type="submit" style={{ ...buttonStyle, marginRight: "10px" }}>{loading ? "Processing..." : editBook ? "Update" : "Simpan"}</button>
                  <button type="button" style={buttonStyle} onClick={() => { setIsModalOpen(false); setEditBook(null); setForm({ title: "", writer: "", publisher: "", publication_year: "", description: "", price: "", stock_quantity: "", genre_id: "" }); }}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
