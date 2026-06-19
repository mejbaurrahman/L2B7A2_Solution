import type { Request } from "express";
import { pool } from "../../db";
import type { IIssue } from "../../types";

const insertIssueIntoDB = async (payload: IIssue, reporter: number)=>{
    const {title, description, type, status} = payload
    
    const result = await pool.query(
        "INSERT INTO issues (title, description, type, status, reporter_id) VALUES ($1, $2, $3,  COALESCE($4, 'open'), $5) RETURNING *",
        [title, description, type, status, reporter]
      );
    
      return result;
}

export const issueService = {
    insertIssueIntoDB
}