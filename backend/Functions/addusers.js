require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../STUDENT/Users/models/users");

// 🔹 Conectare la MongoDB folosind MONGO_URI direct din .env
const MONGO_URI = process.env.MONGO_URI;

const addUsers = async () => {
  try {
    console.log("🔄 Începem inserarea utilizatorilor...");

    const users = [
      // { name: "Enache", email: "enachegeanina20@stud.ase.ro", password: "password123", role: "student" },
      // { name: "Ion Popescu", email: "c", password: "studentpass", role: "student" },
      // { name: "Mircea Cartarescu", email: "Mircea20@stud.ase.ro", password: "adminpass", role: "student" },
      // 
      { name: "Manager Cantina", email: "manager.cantina@ase.ro", password: "manager123", role: "employee" }
    ];

    // 🔹 Hash-uim parolele înainte de a salva utilizatorii
    for (let user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // 🔹 Inserăm utilizatorii în baza de date
    const result = await User.insertMany(users);
    console.log("✅ Utilizatorii au fost adăugați cu succes!", result);

  } catch (error) {
    console.error("❌ Eroare la adăugarea utilizatorilor:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 Conexiunea la MongoDB a fost închisă.");
  }
};

// 🔹 Conectare la MongoDB și rulare inserare
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("✅ Conectat la MongoDB");
  addUsers();
})
.catch(err => console.error("❌ Eroare la conectare:", err));
