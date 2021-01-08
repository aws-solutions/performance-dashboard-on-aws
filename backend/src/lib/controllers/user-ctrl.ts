import { Request, Response } from "express";
import UserRepository from "../repositories/user-repo";
import AuthService from "../services/auth";

async function getUsers(req: Request, res: Response) {
  const user = AuthService.getCurrentUser(req);

  if (!user) {
    res.status(401);
    return res.send("Unauthorized");
  }

  const repo = UserRepository.getInstance();
  try {
    const users = await repo.listUsers();
    return res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
}

export default {
  getUsers,
};
