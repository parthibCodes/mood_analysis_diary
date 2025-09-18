import { Router } from "express";
import { userAuth } from "../middlewares/user.auth.js";
const router = Router();
import { registerUser, loginUser, logoutUser } from "../controllers/user.controllers.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(userAuth,logoutUser);

export default router;