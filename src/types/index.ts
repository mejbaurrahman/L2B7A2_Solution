export type UserRole = "contributor" | "maintainer";
export type IUser = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
};
