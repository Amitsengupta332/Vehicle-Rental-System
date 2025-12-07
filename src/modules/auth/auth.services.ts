// import bcrypt from "bcryptjs";
// import { pool } from "../../config/db";

// const signupUsers = async (payload: Record<string, unknown>) => {
//   const { name, email, password, phone, role } = payload;

//   const hashedPassword = bcrypt.hashSync(password as string, 10);
//   const result = await pool.query(
//     `
//     INSERT INTO users (name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role
//     `,
//     [name, email, hashedPassword, phone, role]
//   );

//   return result.rows[0];
// };

// export const authServices = { signupUsers };

import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

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

export const authServices = { signupUsers };

