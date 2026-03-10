import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    API.get("/dashboard")
      .then((res) => setData(res.data));

  }, []);


  const handleSearch = async (value) => {

    setSearch(value);

    if (!value) {
      setResults([]);
      return;
    }

    const res = await API.get(`/customers/search?q=${value}`);

    setResults(res.data);

  };


  if (!data) return <p style={{ padding: "40px" }}>Loading Dashboard...</p>;


  return (

    <div
      style={{
        padding: "30px",
        background: "#0f172a",
        minHeight: "100vh",
        color: "white"
      }}
    >

      {/* TITLE */}

      <h1
        style={{
          fontSize: "28px",
          marginBottom: "20px"
        }}
      >
        🪙 Jewellery Loan Dashboard
      </h1>


      {/* SEARCH BOX */}

      <div style={{ marginTop: "20px", position: "relative" }}>

        <input
          placeholder="🔎 Search customer by name or mobile"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: "14px",
            width: "350px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "15px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
          }}
        />


        {results.length > 0 && (

          <div
            style={{
              position: "absolute",
              background: "#1e293b",
              border: "1px solid #334155",
              width: "350px",
              marginTop: "8px",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              overflow: "hidden",
              zIndex: 10
            }}
          >

            {results.map((c) => (

              <div
                key={c._id}
                style={{
                  padding: "12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #334155"
                }}
                onClick={() => navigate(`/customer/${c._id}`)}
              >
                <strong>{c.name}</strong>
                <br />
                <small>{c.mobile}</small>
              </div>

            ))}

          </div>

        )}

      </div>


      {/* DASHBOARD CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "40px"
        }}
      >

        <DashboardCard
          title="Total Customers"
          value={data.totalCustomers}
        />

        <DashboardCard
          title="Total Dhiran Amount"
          value={`₹ ${data.totalLoanAmount}`}
        />

        <DashboardCard
          title="Principal Paid"
          value={`₹ ${data.totalPrincipalPaid}`}
        />

        <DashboardCard
          title="Interest Earned"
          value={`₹ ${data.totalInterestEarned}`}
        />

        <DashboardCard
          title="Total Paid"
          value={`₹ ${data.totalPaid}`}
        />

        <DashboardCard
          title="Remaining Amount"
          value={`₹ ${data.totalRemaining}`}
        />

      </div>

    </div>

  );

};

export default Dashboard;