const DashboardCard = ({ title, value }) => {

  const getColor = () => {

    if (title.includes("Customers")) return "#3B82F6"; // blue
    if (title.includes("Dhiran")) return "#F59E0B"; // gold
    if (title.includes("Principal")) return "#10B981"; // green
    if (title.includes("Interest")) return "#8B5CF6"; // purple
    if (title.includes("Remaining")) return "#EF4444"; // red
    if (title.includes("Paid")) return "#14B8A6"; // teal

    return "#6B7280";

  };

  const color = getColor();

  return (

    <div
      style={{
        background: "#1e293b",
        borderRadius: "16px",
        padding: "25px",
        minHeight: "120px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        border: `1px solid ${color}`,
        transition: "0.3s",
        cursor: "default"
      }}
    >

      <h4
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#cbd5f5",
          letterSpacing: "0.5px"
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          marginTop: "15px",
          fontSize: "28px",
          fontWeight: "bold",
          color: color
        }}
      >
        {value}
      </h2>

    </div>

  );

};

export default DashboardCard;