import mysql from "mysql2/promise";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "quiz_app"
});

const app = express();
app.use(cors());
app.use(express.json());



app.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
})


app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  // result.insertId contiene l'id appena creato
  res.json({ id: result.insertId, name, email });
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Cerco l'utente usando l'email
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (rows.length === 0) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ id: user.id, name: user.name, email: user.email });
});


app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  res.json(rows[0]);
})


app.get("/statistics/:id", async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query("SELECT * FROM quiz_taken WHERE fkuser = ?", [id]);
  res.json(rows);
})


app.post("/statistics", async (req, res) => {
  const { fkuser, punteggio_ottenuto, punteggio_totale } = req.body;
  await db.query("INSERT INTO quiz_taken (fkuser, punteggio_ottenuto, punteggio_totale) VALUES (?, ?, ?)", [fkuser, punteggio_ottenuto, punteggio_totale]);
  res.json({ message: "Statistics updated successfully" });
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
