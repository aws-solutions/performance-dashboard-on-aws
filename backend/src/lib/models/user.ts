export enum Role {
  Admin = "Admin",
  Editor = "Editor",
  Publisher = "Publisher",
}

export interface User {
  userId: string;
  enabled?: boolean;
  userStatus?: string;
  sub?: string;
  email?: string;
  roles?: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}
