import type { Request, Response } from "express";
import { issueService } from "./issue.service";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter = req.user!.id;

    const result = await issueService.insertIssueIntoDB(
      req.body,
      reporter
    );

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        err instanceof Error ? err.message : "Issue creation failed",
      errors: err,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDB(req.query);

    res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Failed to retrieve issues",
      errors: err,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getSingleIssueFromDB(
      Number(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Failed to retrieve issue",
      errors: err,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const user = {
      id: req.user!.id,
      role: req.user!.role,
    };

    const result = await issueService.updateIssueIntoDB(
      Number(req.params.id),
      req.body,
      user
    );

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message:
        err instanceof Error ? err.message : "Issue update failed",
      errors: err,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    await issueService.deleteIssueFromDB(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message:
        err instanceof Error ? err.message : "Issue deletion failed",
      errors: err,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};