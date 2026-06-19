import type { Request, Response } from "express"
import { issueService } from "./issue.service"

const createIssue = async(req: Request, res: Response)=>{
    
     try{
         const reporter = req.user?.id; 
          const result = await issueService.insertIssueIntoDB(req.body, reporter);
          res.status(200).json({
             "success": true,
      "message": "Issue created successfully",
      data: result
          })
       }catch(err){
          res.status(500).json({
             success: false,
             message: err instanceof Error ? err.message : "Issue Creation Failed"
          })
       }
    
    
}

const getAllIssues = async(req: Request, res: Response)=>{
       try{
           
       }catch(err){
           res.status(500).json({
               success: false,
               message: err instanceof Error ? err.message : "Failed to retrieve issues"
           })
       }
}

export const issueController ={
    createIssue,
    getAllIssues
}