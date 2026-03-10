import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Customers = () => {

  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/customers", form);
    setForm({ name: "", mobile: "", address: "" });
    fetchCustomers();
  };

  return (

    <div
      style={{
        padding: "30px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white"
      }}
    >

      <h1 style={{ marginBottom: "20px" }}>
        👥 Customers
      </h1>


      {/* ADD CUSTOMER FORM */}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
        }}
      >

        <input
          placeholder="Customer Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            width: "200px"
          }}
        />

        <input
          placeholder="Mobile"
          value={form.mobile}
          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
          required
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            width: "150px"
          }}
        />

        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            width: "250px"
          }}
        />

        <button
          type="submit"
          style={{
            background: "#f59e0b",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Add Customer
        </button>

      </form>


      {/* CUSTOMER TABLE */}

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
        }}
      >

        <table
          width="100%"
          style={{
            borderCollapse: "collapse",
            color: "white"
          }}
        >

          <thead>

            <tr style={{ background: "#334155" }}>

              <th style={thStyle}>Name</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Address</th>

            </tr>

          </thead>

          <tbody>

            {customers.map((c) => (

              <tr
                key={c._id}
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid #334155"
                }}
                onClick={() => navigate(`/customer/${c._id}`)}
              >

                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.mobile}</td>
                <td style={tdStyle}>{c.address}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

};


const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
};


export default Customers;