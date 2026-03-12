import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Login from "./pages/Login";

const token = localStorage.getItem("token");

if (!token && window.location.pathname !== "/login") {
  window.location.href = "/login";
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customer/:id" element={<CustomerDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;