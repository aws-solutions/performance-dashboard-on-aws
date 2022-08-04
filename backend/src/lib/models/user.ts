export enum Role {
  Admin = "Admin",
  Editor = "Editor",
  /**
   * @type {string}
   * @deprecated no longer supported
   */
  Publisher = "Publisher",
  Public = "Public",
}

export interface User {
  userId: string;
  enabled?: boolean;
  userStatus?: string;
  sub?: string;
  email?: string;
  roles?: Array<Role>;
  createdAt?: Date;
  updatedAt?: Date;
}
