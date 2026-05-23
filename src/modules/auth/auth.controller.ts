import  bcrypt  from 'bcrypt';

import type { Request, Response } from "express";
import { authService } from './auth.service';
const createUser = async (req: Request, res: Response) => {
   try {
   const result = await authService.insertUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Not created",
    });
  }
};

const loginUser = async(req: Request, res: Response)=>{
   try{
      const result = await authService.loginIntoDB(req.body);
      res.status(200).json({
         "success": true,
  "message": "Login successful",
  data: result
      })
   }catch(err){
      res.status(404).json({
         success: false,
         message: err instanceof Error ? err.message : "Login Failed"
      })
   }

}




export const authController={
   createUser,
   loginUser
}
