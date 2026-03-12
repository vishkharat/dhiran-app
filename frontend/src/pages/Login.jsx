import { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const res = await axios.post(
        "https://dhiran-app.onrender.com/api/auth/login",
        {
          username,
          password
        }
      );

      localStorage.setItem("token", res.data.token);

      window.location.href = "/";

    } catch (error) {

      alert("Invalid Username or Password");

    }

  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.title}>BHAGVATI JEWELLERS</h2>
        <p style={styles.subtitle}>Admin Login</p>

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>

  );

}

const styles = {

  container:{
    height:"100vh",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"linear-gradient(135deg,#1e3c72,#2a5298)"
  },

  card:{
    background:"white",
    padding:"40px",
    borderRadius:"10px",
    width:"300px",
    textAlign:"center",
    boxShadow:"0 10px 30px rgba(0,0,0,0.2)"
  },

  title:{
    marginBottom:"5px"
  },

  subtitle:{
    marginBottom:"20px",
    color:"gray"
  },

  input:{
    width:"100%",
    padding:"10px",
    marginBottom:"15px",
    borderRadius:"5px",
    border:"1px solid #ccc"
  },

  button:{
    width:"100%",
    padding:"10px",
    border:"none",
    borderRadius:"5px",
    background:"#1e3c72",
    color:"white",
    fontWeight:"bold",
    cursor:"pointer"
  }

};

export default Login;