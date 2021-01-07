export type User = {
  userId: string;
  enabled?: boolean;
  userStatus?: string;
  sub?: string;
  email?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
