import { pool } from './../../db';
import type { IUser } from "../../types";
import bcrypt from 'bcrypt'
const insertUserIntoDB = async (payload: any)=>{
    const { name, email, password, role } = payload;
  const checkExistence = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if ((checkExistence.rowCount ?? 0) > 0) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // insert user
  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email, hashedPassword, role]
  );

  return result;
}

const loginIntoDB = async (payload: any)=>{

    const {email, password} = payload;
    const retriveData = await pool.query(`
        SELECT email, password from users where email=$1`, [email])
    
    const data = retriveData.rows[0]
    const matchPassowrd = await bcrypt.compare(password, data.password);
  if (!matchPassowrd) {
    throw new Error("Invalid password");
  }
  
}
export const authService = {
    insertUserIntoDB,
    loginIntoDB
}