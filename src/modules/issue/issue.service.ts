import { pool } from "../../db";
import type { IIssue } from "../../types";

const insertIssueIntoDB = async (
  payload: IIssue,
  reporter: number
) => {
  const { title, description, type, status } = payload;

  const result = await pool.query(
    `INSERT INTO issues
    (title, description, type, status, reporter_id)
    VALUES ($1,$2,$3,COALESCE($4,'open'),$5)
    RETURNING *`,
    [title, description, type, status, reporter]
  );

  return result.rows[0];
};

const getAllIssuesFromDB = async (query: any) => {
  const { sort = "newest", type, status } = query;

  let sql = `SELECT * FROM issues`;
  const values: any[] = [];
  const conditions: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type=$${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status=$${values.length}`);
  }

  if (conditions.length) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql +=
    sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issueResult = await pool.query(sql, values);

  const issues = issueResult.rows;

  if (!issues.length) {
    return [];
  }

  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  const reporterResult = await pool.query(
    `SELECT id,name,role
     FROM users
     WHERE id = ANY($1::int[])`,
    [reporterIds]
  );

  const reporterMap = new Map();

  reporterResult.rows.forEach((user) => {
    reporterMap.set(user.id, user);
  });

  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterMap.get(issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
};

const getSingleIssueFromDB = async (id: number) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id=$1`,
    [id]
  );

  if (!issueResult.rows.length) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `SELECT id,name,role
     FROM users
     WHERE id=$1`,
    [issue.reporter_id]
  );

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporterResult.rows[0],
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const updateIssueIntoDB = async (
  issueId: number,
  payload: Partial<IIssue>,
  user: { id: number; role: string }
) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id=$1`,
    [issueId]
  );

  if (!issueResult.rows.length) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];

  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You are not authorized to update this issue.");
    }

    if (issue.status !== "open") {
      throw new Error("Only open issues can be updated.");
    }
  }

  const title = payload.title ?? issue.title;
  const description = payload.description ?? issue.description;
  const type = payload.type ?? issue.type;

  const result = await pool.query(
    `UPDATE issues
     SET
        title=$1,
        description=$2,
        type=$3,
        updated_at=CURRENT_TIMESTAMP
     WHERE id=$4
     RETURNING *`,
    [title, description, type, issueId]
  );

  return result.rows[0];
};

const deleteIssueFromDB = async (issueId: number) => {
  const issueResult = await pool.query(
    `SELECT id FROM issues WHERE id=$1`,
    [issueId]
  );

  if (!issueResult.rows.length) {
    throw new Error("Issue not found");
  }

  await pool.query(
    `DELETE FROM issues WHERE id=$1`,
    [issueId]
  );
};

export const issueService = {
  insertIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};