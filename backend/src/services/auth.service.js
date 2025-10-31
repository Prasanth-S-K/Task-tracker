import { getDBConnection } from "../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required." });

    const db = getDBConnection();
    const existing = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);

    if (existing) {
      db.close();
      return res.status(409).json({ error: "Username already exists." });
    }

    const password_hash = await bcrypt.hash(password, 10);
    db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(
      username,
      password_hash
    );
    db.close();

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required." });

    const db = getDBConnection();
    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);
    db.close();

    if (!user)
      return res.status(401).json({ error: "Invalid username or password." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: "Invalid username or password." });

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Login successful.",
      token,
      username: user.username,
      expiresIn: JWT_EXPIRES_IN,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
