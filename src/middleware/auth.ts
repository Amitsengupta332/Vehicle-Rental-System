import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      // 1️⃣ Token missing
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Token missing",
        });
      }

      // 2️⃣ Extract the token
      const token = authHeader.split(" ")[1];

      // 3️⃣ Decode the token
      const decoded: any = jwt.verify(token as string, config.jwtSecret as string);

      // 4️⃣ Check if user actually exists in DB
      const userResult = await pool.query(
        "SELECT id, name, email, phone, role FROM users WHERE email=$1",
        [decoded.email]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User no longer exists",
        });
      }

      const user = userResult.rows[0];

      // 5️⃣ Check role
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You are not allowed",
        });
      }

      // 6️⃣ Attach verified user to request
      req.user = user;

      next();
    } catch (err: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
};

export default auth;
