import React, { useState } from "react";
import "../App.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAttempts(prev => prev + 1);
        if (data.error.includes("Too many login attempts")) {
          setMessage("Ai depășit limita de 3 încercări. Te rugăm să încerci mai târziu!");
        } else {
          setMessage("Utilizator sau parolă greșite. Încercare " + (attempts + 1) + " din 3");
        }
        return;
      }

      // restart the login attempts
      setAttempts(0);
      localStorage.setItem("token", data.token);
      setMessage("Success!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit" disabled={attempts >= 3}>Login</button>
      </form>
      <p className="forgot-password">Ai uitat parola? <a href="#">Recuperează parola</a></p>
    </div>
  );
};

export default Login;