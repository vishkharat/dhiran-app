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

    <div style={{ padding: "40px", textAlign: "center" }}>

      <h2>Shop Login</h2>

      <br/>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleLogin}>
        Login
      </button>

    </div>

  );

}

export default Login;