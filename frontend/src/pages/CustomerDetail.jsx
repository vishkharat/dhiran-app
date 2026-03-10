import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

const CustomerDetail = () => {

  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [dhiranList, setDhiranList] = useState([]);
  const [paidMap, setPaidMap] = useState({});

  const [dhiranForm, setDhiranForm] = useState({
    amount: "",
    purity: "",
    weight: "",
    interestRate: "",
    description: "",
    startDate: ""
  });

  const [selectedDhiran, setSelectedDhiran] = useState(null);

  const [principalPaid, setPrincipalPaid] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  const [ledger, setLedger] = useState([]);

  const loadCustomer = async () => {
    const res = await API.get(`/customers/${id}`);
    setCustomer(res.data);
  };

  const loadDhiran = async () => {
    const res = await API.get(`/dhiran/${id}`);
    setDhiranList(res.data);
  };

  useEffect(() => {
    loadCustomer();
    loadDhiran();
  }, []);

  const loadPaid = async () => {

    let map = {};

    for (let d of dhiranList) {

      const res = await API.get(`/payments/total/${d._id}`);

      map[d._id] = res.data.totalPrincipal || 0;

    }

    setPaidMap(map);
  };

  useEffect(() => {
    if (dhiranList.length > 0) {
      loadPaid();
    }
  }, [dhiranList]);

  const addDhiran = async (e) => {

    e.preventDefault();

    await API.post("/dhiran", {
      customer: id,
      amount: Number(dhiranForm.amount),
      purity: dhiranForm.purity,
      weight: Number(dhiranForm.weight),
      interestRate: Number(dhiranForm.interestRate),
      description: dhiranForm.description,
      startDate: dhiranForm.startDate
    });

    setDhiranForm({
      amount: "",
      purity: "",
      weight: "",
      interestRate: "",
      description: "",
      startDate: ""
    });

    loadDhiran();
  };

  const addPayment = async (e) => {

    e.preventDefault();

    try {

      await API.post("/payments", {
        dhiranId: selectedDhiran._id,
        principalPaid: Number(principalPaid),
        paymentDate: paymentDate
      });

      setPrincipalPaid("");
      setPaymentDate("");
      setSelectedDhiran(null);
      setLedger([]);

      loadDhiran();
      loadPaid();

    } catch (err) {

      console.error("Payment Error:", err.response?.data || err.message);

    }

  };

  const closeDhiran = async (dhiranId) => {

    try {

      await API.put(`/dhiran/close/${dhiranId}`);

      alert("Dhiran Closed Successfully");

      loadDhiran();

    } catch (err) {

      alert(err.response?.data?.message || "Error closing dhiran");

    }

  };

  const loadLedger = async (dhiranId) => {

    const res = await API.get(`/payments/dhiran/${dhiranId}`);

    setLedger(res.data);

  };

  const downloadLedger = async () => {

    try {

      const res = await API.get(`/reports/customer-ledger/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "ledger.pdf");

      document.body.appendChild(link);

      link.click();

    } catch (err) {

      console.error("PDF Download Error", err);

    }

  };

  return (

    <div style={pageStyle}>

      <h1 style={titleStyle}>Customer Dhiran Details</h1>

      {customer && (

        <div style={customerCard}>

          <div>
            <h2>{customer.name}</h2>
            <p>📞 {customer.mobile}</p>
            <p>📍 {customer.address}</p>
          </div>

          <button onClick={downloadLedger} style={downloadBtn}>
            Download Customer Ledger PDF
          </button>

        </div>

      )}

      <h2 style={sectionTitle}>Add Dhiran</h2>

      <form onSubmit={addDhiran} style={formCard}>

        <input style={input} placeholder="Dhiran Amount"
          value={dhiranForm.amount}
          onChange={(e) => setDhiranForm({ ...dhiranForm, amount: e.target.value })}
          required />

        <input style={input} placeholder="Purity (eg: 22K)"
          value={dhiranForm.purity}
          onChange={(e) => setDhiranForm({ ...dhiranForm, purity: e.target.value })}
          required />

        <input style={input} placeholder="Weight (grams)"
          value={dhiranForm.weight}
          onChange={(e) => setDhiranForm({ ...dhiranForm, weight: e.target.value })}
          required />

        <input style={input} placeholder="Interest %"
          value={dhiranForm.interestRate}
          onChange={(e) => setDhiranForm({ ...dhiranForm, interestRate: e.target.value })}
          required />

        <input style={input} placeholder="Description"
          value={dhiranForm.description}
          onChange={(e) => setDhiranForm({ ...dhiranForm, description: e.target.value })} />

        <input style={input} type="date"
          value={dhiranForm.startDate}
          onChange={(e) => setDhiranForm({ ...dhiranForm, startDate: e.target.value })} />

        <button style={addBtn}>Add Dhiran</button>

      </form>

      <h2 style={sectionTitle}>Dhiran List</h2>

      {dhiranList.map((d, index) => {

        const paid = paidMap[d._id] || 0;

        const storedInterest = d.totalInterest || 0;
        const liveInterest = d.liveInterest || 0;

        const interest = storedInterest + liveInterest;

        const total = d.amount + interest;

        const principalRemaining = d.amount - paid;
        const remaining = principalRemaining + liveInterest;

        return (

          <div key={d._id} style={dhiranCard}>

            <h3>Dhiran {index + 1}</h3>

            <div style={infoGrid}>

              <p>Amount: ₹{d.amount}</p>
              <p>Weight: {d.weight} grams</p>
              <p>Stored Interest: ₹{storedInterest}</p>
              <p>Live Interest: ₹{liveInterest}</p>
              <p>Total Amount: ₹{total}</p>
              <p>Paid: ₹{paid}</p>
              <p><b>Remaining: ₹{remaining}</b></p>
              <p>Purity: {d.purity}</p>
              <p>Interest Rate: {d.interestRate}%</p>
              <p>Description: {d.description}</p>
              <p>Date: {new Date(d.startDate).toLocaleDateString()}</p>

            </div>

            <div style={{ marginTop: "15px" }}>

              {d.status !== "CLOSED" && (

                <button
                  onClick={() => setSelectedDhiran(d)}
                  style={paymentBtn}
                >
                  Add Payment
                </button>

              )}

              <button
                onClick={() => loadLedger(d._id)}
                style={ledgerBtn}
              >
                View Ledger
              </button>

            </div>

          </div>

        );

      })}

      {selectedDhiran && (

        <div style={paymentCard}>

          <h3 style={{marginBottom:"20px"}}>Add Payment</h3>

          <form onSubmit={addPayment} style={paymentForm}>

            <input
              style={input}
              placeholder="Principal Paid"
              value={principalPaid}
              onChange={(e) => setPrincipalPaid(e.target.value)}
              required
            />

            <input
              style={input}
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />

            <p style={{width:"100%"}}>Interest will be auto calculated</p>

            <div style={btnRow}>

              <button style={addBtn}>Add Payment</button>

              <button
                type="button"
                style={cancelBtn}
                onClick={() => setSelectedDhiran(null)}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      {ledger.length > 0 && (

        <div style={{ marginTop: "30px" }}>

          <h2>Ledger</h2>

          {ledger.map((p, i) => (

            <div key={p._id} style={ledgerCard}>

              <b>Entry {i + 1}</b>

              <p>{p.note}</p>

            </div>

          ))}

        </div>

      )}

    </div>

  );
};

const pageStyle = {
  padding: "30px",
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f172a,#1e293b,#0f172a)",
  color: "white"
};

const titleStyle = {
  fontSize: "32px",
  marginBottom: "20px"
};

const sectionTitle = {
  marginTop: "30px"
};

const customerCard = {
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(10px)",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "30px"
};

const formCard = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "15px",
  background: "rgba(255,255,255,0.08)",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "30px"
};

const dhiranCard = {
  background: "rgba(255,255,255,0.08)",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: "10px"
};

const paymentCard = {
  background: "rgba(255,255,255,0.08)",
  padding: "25px",
  borderRadius: "12px",
  marginTop: "25px"
};

const paymentForm = {
  display: "flex",
  flexWrap: "wrap",
  gap: "15px",
  alignItems: "center"
};

const btnRow = {
  display: "flex",
  gap: "10px"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "none"
};

const addBtn = {
  padding: "10px 16px",
  background: "#10b981",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const cancelBtn = {
  padding: "10px 16px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const paymentBtn = {
  padding: "8px 14px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  marginRight: "10px"
};

const ledgerBtn = {
  padding: "8px 14px",
  background: "#6366f1",
  color: "#fff",
  border: "none",
  borderRadius: "6px"
};

const downloadBtn = {
  padding: "10px 16px",
  background: "#f59e0b",
  color: "#000",
  border: "none",
  borderRadius: "6px"
};

const ledgerCard = {
  background: "rgba(255,255,255,0.08)",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "10px"
};

export default CustomerDetail;