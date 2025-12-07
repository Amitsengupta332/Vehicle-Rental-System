import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No users found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
    
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to retrieve users",
    });
  }
};

export const userController = {
  getAllUsers,
};
