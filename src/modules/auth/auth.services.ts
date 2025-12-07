 

import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signupUsers = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !phone) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Email check
  const exists = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (exists.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const result = await pool.query(
    `
      INSERT INTO users (name, email, password, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, role
    `,
    [name, email.toLowerCase(), hashedPassword, phone, role || "customer"]
  );

  return result.rows[0];
};


const signinUsers = async (payload: Record<string, any>) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check user exists
  const userQuery = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (userQuery.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = userQuery.rows[0];

  // Match password
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  // Remove password before sending
  delete user.password;

  return {
    token,
    user,
  };
};


export const authServices = { signupUsers, signinUsers };

