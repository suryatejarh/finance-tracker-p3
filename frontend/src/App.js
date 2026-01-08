import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedFinanceTracker from "./components/ProtectedFinanceTracker";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedFinanceTracker />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
