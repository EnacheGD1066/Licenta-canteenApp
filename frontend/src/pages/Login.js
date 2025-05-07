

import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const isAdmin = email === "admin@cantina.ase.ro";
    const endpoint = isAdmin ? "/api/admin/auth/login" : "/api/auth/login";

    try {
     const response = await fetch(`http://localhost:5000${endpoint}`, {
     method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
           });
      const data = await response.json();

      if (response.ok) {
       
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        onLoginSuccess(data.token);
      } else {
        alert("Eroare la autentificare: " + data.error);
      }
    } catch (err) {
      alert("Eroare la conectare cu serverul.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Parolă" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;


