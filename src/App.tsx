import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BooksPage from "./pages/BooksPage";
import TransactionsPage from "./pages/TransactionsPage";
import GenrePage from "./pages/GenrePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman utama langsung ke Register */}
        <Route path="/" element={<RegisterPage />} />

        {/* Halaman publik */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Halaman dilindungi */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/genres"
          element={
            <ProtectedRoute>
              <GenrePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
