import { Request, Response } from "express";
import HomepageFactory from "../factories/homepage-factory";
import HomepageRepository from "../repositories/homepage-repo";

async function getHomepage(req: Request, res: Response) {
  const repo = HomepageRepository.getInstance();
  const homepage = await repo.getHomepage();

  if (!homepage) {
    return res.json(HomepageFactory.getDefaultHomepage());
  }

  return res.json(homepage);
}

export default {
  getHomepage,
};
