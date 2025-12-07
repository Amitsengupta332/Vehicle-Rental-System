// // import { Request, Response } from "express";
// // import { userServices } from "./user.service";
// // import { pool } from "../../config/db";

// // const getAllUsers = async (req: Request, res: Response) => {
// //   try {
// //     const users = await userServices.getAllUsers();

// //     if (users.length === 0) {
// //       return res.status(200).json({
// //         success: true,
// //         message: "No users found",
// //         data: [],
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       message: "Users retrieved successfully",
// //       data: users,
// //     });
    
// //   } catch (error: any) {
// //     return res.status(500).json({
// //       success: false,
// //       message: error.message || "Unable to retrieve users",
// //     });
// //   }
// // };

// // const UpdateUser = async (req: Request, res: Response) => {
// //   const { name, email, phone, role } = req.body;
// //   const id = req.params.userId;

// //   try {

// //     if (!["admin", "customer"].includes(role)) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Role must be admin or customer",
// //       });
// //     }
   
// //     const result = await userServices.updateUserDB(name, email, phone, role, id)
// //     if (result.rows.length === 0) {
// //       res.status(404).json({
// //         success: false,
// //         message: "user not found",
// //       });
// //     } else {
// //       res.status(200).json({
// //         success: true,
// //         message: "User updated successfully",
// //         data: result.rows[0],
// //       });
// //     }
// //   } catch (error: any) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // }
// // const deleteUser = async (req: Request, res: Response) => {
// //   const id = req.params.userId;
// //   try {
// //     const userBooking = await pool.query(
// //         `SELECT * FROM bookings WHERE customer_id=$1`,[id]
// //     )
// //     if(userBooking.rows.length > 0){
// //         return res.status(400).json({
// //         success: false,
// //         message: "Can't delete user because he has bookings",
// //     })
// //     }

// //     const result = await userServices.deleteUserDB(id);
// //     if (result.rowCount === 0) {
// //       res.status(404).json({
// //         success: false,
// //         message: "user not found",
// //       });
// //     } else {
// //       res.status(200).json({
// //         success: true,
// //         message: "User deleted successfully"
// //       });
// //     }
// //   } catch (error: any) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // }


// // export const userController = {
// //   getAllUsers,
// //   UpdateUser,
// //   deleteUser
// // };


// import { Request, Response } from "express";
// import { userServices } from "./user.service";
// import { pool } from "../../config/db";

// const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await userServices.getAllUsers();

//     if (users.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No users found",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Users retrieved successfully",
//       data: users,
//     });

//   } catch (error: any) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const userController = {
//   getAllUsers,
// };

import { Request, Response } from "express";
 
import { pool } from "../../config/db";
import { userServices } from "./user.service";
import { UserRole } from "../../types/roles";

// --------------------------------------------------
// GET ALL USERS (Admin Only)
// --------------------------------------------------
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
      message: error.message,
    });
  }
};


// --------------------------------------------------
// UPDATE USER (Admin OR Own Profile)
// --------------------------------------------------
const updateUser = async (req: Request, res: Response) => {
  const loggedUser = req.user;

  if (!loggedUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  }

  const userId = Number(req.params.userId);
  const { name, email, phone, role } = req.body;

  try {
    // Customer can only update own profile
    if (loggedUser.role === UserRole.Customer && loggedUser.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Customers can update only their own profile",
      });
    }

    // Customer cannot change role
    let finalRole = role;
    if (loggedUser.role === UserRole.Customer) {
      finalRole = loggedUser.role;
    }

    const updatedUser = await userServices.updateUserDB(
      userId,
      name,
      email,
      phone,
      finalRole
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// --------------------------------------------------
// DELETE USER (Admin Only + No Active Bookings)
// --------------------------------------------------
const deleteUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  try {
    // Check active bookings
    const activeBookings = await pool.query(
      `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
      [userId]
    );

    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete user with active bookings",
      });
    }

    const deleted = await userServices.deleteUserDB(userId);

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const userController = { 
  getAllUsers,
  updateUser,
  deleteUser
};
