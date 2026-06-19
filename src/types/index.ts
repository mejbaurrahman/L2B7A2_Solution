export type UserRole = "contributor" | "maintainer";
export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer"
} as const;

export type IUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
};

export type IssueType = "bug" | "feature_request";

export type IssueStatus = "open" | "in_progress" | "resolved";
export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: IssueType;
  status?: IssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}