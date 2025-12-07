// import { pool } from "../../config/db";

// const getAllUsers = async () => {
//   const result = await pool.query(
//     `SELECT id, name, email, phone, role FROM users`
//   );
//   return result.rows;
// };

// const updateUserDB = async(name:string, email:string, phone:string, role:string, id:any)=>{
//     const result = await pool.query(
//       `UPDATE users SET name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING *`,
//       [name, email, phone, role, id]
//     );
//    return result
// }
// const deleteUserDB = async(id:any)=>{
//     const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
//     return result
// }

// export const userServices = {
//   getAllUsers,
//   updateUserDB,
//   deleteUserDB
// };
import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );
  return result.rows;
};

const updateUserDB = async (id: number, name: string, email: string, phone: string, role: string) => {
  const result = await pool.query(
    `UPDATE users 
     SET name=$1, email=$2, phone=$3, role=$4 
     WHERE id=$5 
     RETURNING id, name, email, phone, role`,
    [name, email, phone, role, id]
  );

  return result.rows[0];
};

const deleteUserDB = async (id: number) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result.rowCount;
};

export const userServices = {
  getAllUsers,
  updateUserDB,
  deleteUserDB,
};
