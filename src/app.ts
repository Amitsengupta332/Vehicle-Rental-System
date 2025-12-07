import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/users/user.routes";

const app = express();
// parser

app.use(express.json());

//db
initDB();

// "/" -> localhost:5000/
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});
//user crud
app.use("/api/v1/users", userRoutes);
// // vehicle crud
// app.use("/api/v1/vehicles",vehiclesRoutes);
// //booking crud
// app.use("/api/v1/bookings", bookingRoutes);
//auth route
app.use("/api/v1/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
