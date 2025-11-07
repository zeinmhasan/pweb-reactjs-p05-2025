// src/pages/TransactionPage.tsx
import { useState, useEffect, useCallback } from "react";
import api from "../api";
import Navbar from "../components/Navbar";

interface Genre { id: string; name: string; }
interface Book { id: string; title: string; price: number; genre?: Genre; stock_quantity: number; }
interface OrderItem { id: string; quantity: number; book?: Book; }
interface Transaction { id: string; quantity: number; created_at: string; order_items: OrderItem[]; }
interface PaginationMeta { page: number; limit: number; totalItems: number; totalPages: number; }
interface CheckoutItem { book_id: string; quantity: number; }

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([]);

  const fetchBooks = useCallback(async () => {
    try {
      const res = await api.get<{ data: Book[] }>("/books");
      setBooks(res.data.data);
    } catch (err) { console.error("Gagal memuat buku:", err); }
  }, []);

  const fetchTransactions = useCallback(async (pageNum: number = 1) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get<{ data: Transaction[]; meta: PaginationMeta }>("/transactions", { params: { page: pageNum, limit: 10 } });
      setTransactions(res.data.data);
      setMeta(res.data.meta);
    } catch (err: unknown) { console.error("Gagal memuat transaksi:", err); if (err instanceof Error) setMessage(err.message); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTransactions(page); fetchBooks(); }, [fetchTransactions, page, fetchBooks]);

  const handlePrevPage = () => meta && page > 1 && setPage(page - 1);
  const handleNextPage = () => meta && page < meta.totalPages && setPage(page + 1);

  const handleQuantityChange = (bookId: string, qty: number) => {
    setCheckoutItems((prev) => {
      const exists = prev.find((item) => item.book_id === bookId);
      if (exists) return prev.map((item) => item.book_id === bookId ? { ...item, quantity: qty } : item);
      return [...prev, { book_id: bookId, quantity: qty }];
    });
  };

  const handleCheckout = async () => {
    if (checkoutItems.length === 0) { setMessage("❌ Pilih minimal 1 buku untuk checkout"); return; }
    setLoading(true);
    setMessage("");
    try { await api.post("/transactions", { items: checkoutItems }); setMessage("✅ Transaksi berhasil!"); setCheckoutItems([]); setIsModalOpen(false); fetchTransactions(page); }
    catch (err: unknown) { console.error("Gagal membuat transaksi:", err); if (err instanceof Error) setMessage(err.message); } 
    finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem", fontFamily: "'Cinzel', serif", background: "linear-gradient(180deg, #1a1a2b, #2b1a2f)", color: "#fdf6e3", minHeight: "100vh" }}>
        <h1 style={{ textAlign: "center", textShadow: "2px 2px 5px #000" }}>🧾 Transaksi Saya</h1>

        {message && <p style={{ textAlign: "center", color: "#ffcc00", textShadow: "1px 1px 2px #000" }}>{message}</p>}

        <div style={{ textAlign: "center", margin: "1rem 0" }}>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#6a4b9c",
              color: "#fdf6e3",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 10px #8e6fc1"
            }}
          >
            🛒 Buat Transaksi Baru
          </button>
        </div>

        {/* Tabel Transaksi */}
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <>
            <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse", boxShadow: "0 0 10px #000" }}>
              <thead>
                <tr style={{ backgroundColor: "#3b2c4a", color: "#ffd700" }}>
                  <th style={{ padding: "8px" }}>ID Transaksi</th>
                  <th>Tanggal</th>
                  <th>Total Item</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} style={{ backgroundColor: "#2b1a2f", textAlign: "center", color: "#fdf6e3" }}>
                    <td>{t.id}</td>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                    <td>{t.quantity}</td>
                    <td>
                      <details>
                        <summary style={{ cursor: "pointer", textDecoration: "underline", color: "#ffcc00" }}>Lihat Item</summary>
                        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "5px" }}>
                          {t.order_items.map((item) => (
                            <li key={item.id} style={{ marginBottom: "4px" }}>
                              <strong>{item.book?.title || "N/A"}</strong> - Qty: {item.quantity} - Harga: {item.book?.price ?? "N/A"} - Genre: {item.book?.genre?.name || "N/A"}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {meta && (
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <button onClick={handlePrevPage} disabled={page <= 1} style={{ marginRight: "10px" }}>⬅ Prev</button>
                <span>Page {meta.page} / {meta.totalPages}</span>
                <button onClick={handleNextPage} disabled={page >= meta.totalPages} style={{ marginLeft: "10px" }}>Next ➡</button>
              </div>
            )}
          </>
        )}

        {/* Modal Checkout */}
        {isModalOpen && (
          <div style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex", justifyContent: "center", alignItems: "center",
          }}>
            <div style={{
              backgroundColor: "#3b2c4a",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              color: "#fdf6e3",
              boxShadow: "0 0 15px #8e6fc1"
            }}>
              <h3 style={{ textAlign: "center", marginBottom: "15px", color: "#ffcc00" }}>🛒 Pilih Buku untuk Checkout</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {books.map((b) => (
                  <li key={b.id} style={{ marginBottom: "12px", padding: "8px", backgroundColor: "#2b1a2f", borderRadius: "6px", boxShadow: "0 0 5px #000" }}>
                    <strong>{b.title}</strong> - Harga: {b.price} - Stok: {b.stock_quantity} - Genre: {b.genre?.name || "N/A"}
                    <br />
                    <input
                      type="number"
                      min={0}
                      max={b.stock_quantity}
                      placeholder="Qty"
                      value={checkoutItems.find((i) => i.book_id === b.id)?.quantity || ""}
                      onChange={(e) => handleQuantityChange(b.id, Number(e.target.value))}
                      style={{ marginTop: "5px", width: "60px", borderRadius: "4px", padding: "3px" }}
                    />
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <button onClick={handleCheckout} style={{ marginRight: "10px", padding: "8px 16px", borderRadius: "6px", backgroundColor: "#6a4b9c", color: "#fdf6e3", fontWeight: "bold", boxShadow: "0 0 8px #8e6fc1" }}>
                  {loading ? "Processing..." : "Checkout"}
                </button>
                <button onClick={() => { setIsModalOpen(false); setCheckoutItems([]); }} style={{ padding: "8px 16px", borderRadius: "6px", backgroundColor: "#a83232", color: "#fdf6e3", fontWeight: "bold" }}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
