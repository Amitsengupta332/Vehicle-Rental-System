import { Request, Response } from "express";
import { authServices } from "./auth.services";

const signupUsers = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupUsers(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};

export const authController = { signupUsers };
