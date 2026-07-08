import { pool } from './../../db';
import type { IUser } from "../../types";

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import { config } from '../../config';

const insertUserIntoDB = async (payload: any)=>{
  const { name, email, password, role } = payload;
  const checkExistence = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if ((checkExistence.rowCount ?? 0) > 0) {
    throw new Error("User already exists");
  }

 
  const hashedPassword = await bcrypt.hash(password, 10);


  const result = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3,  COALESCE($4, 'contributor')) RETURNING *",
    [name, email, hashedPassword, role]
  );

  return result;
}

const loginIntoDB = async (payload: {email: string, password: string})=>{

    
    const retriveData = await pool.query(`
        SELECT * from users where email=$1`, [payload.email])
    
    const user = retriveData.rows[0]
    const matchPassowrd = await bcrypt.compare(payload.password, user.password);
  if (!matchPassowrd) {
    throw new Error("Invalid password");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const {
    password, ...userWithoutPass
  } = user;
  const accessToken = jwt.sign(jwtPayload, config.jwt, {
    expiresIn: '1d'
  }) 
  return {
    data: {token: accessToken,
    user: userWithoutPass
}
  }
}
export const authService = {
    insertUserIntoDB,
    loginIntoDB
}