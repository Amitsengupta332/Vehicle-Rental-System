import { Request, Response } from "express";

const createVehicles = async (req: Request, res: Response) => {};
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