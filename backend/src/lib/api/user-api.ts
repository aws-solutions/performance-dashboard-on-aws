import { Router } from "express";
import UserCtrl from "../controllers/user-ctrl";
import withErrorHandler from "./middleware/error-handler";
import auth from "./middleware/auth";

const router = Router();
router.use(auth);

router.get("/", withErrorHandler(UserCtrl.getUsers));
router.post("/", withErrorHandler(UserCtrl.addUsers));
router.post("/invite", withErrorHandler(UserCtrl.resendInvite));
router.put("/role", withErrorHandler(UserCtrl.changeRole));

export default router;
