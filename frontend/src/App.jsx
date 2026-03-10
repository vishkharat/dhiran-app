import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customer/:id" element={<CustomerDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;