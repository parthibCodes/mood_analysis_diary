import { Router } from "express";
import { userAuth } from "../middlewares/user.auth.js";
const router = Router();
import { registerUser, loginUser, logoutUser , refreshAccessToken } from "../controllers/user.controllers.js";

router.route("/register").post(registerUser);
router.route("/login").post(userAuth,loginUser);
router.route("/logout").post(userAuth,logoutUser);
router.route("/refreshToken").post(refreshAccessToken);

export default router;