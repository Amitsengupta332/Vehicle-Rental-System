import { Request, Response } from "express";
import { vehiclesServices } from "./vehicles.service";

const createVehicles = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehiclesServices.createVehicles(req.body);
    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getVehicles = async (req: Request, res: Response) => {};
const getSingleVehicles = async (req: Request, res: Response) => {};
const updateVehicles = async (req: Request, res: Response) => {};
const deleteVehicles = async (req: Request, res: Response) => {};
export const vehiclesController = {
  createVehicles,
  getVehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles,
};
