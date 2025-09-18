import { Router } from "express";
const router = Router();
import { addEntry } from "../controllers/entry.controllers.js";
import { getAllEntries } from "../controllers/entry.controllers.js";
import { userAuth } from "../middlewares/user.auth.js";

router.route("/addEntry").post(userAuth,addEntry);
router.route("/getAllEntries/:date").get(userAuth,getAllEntries);

export default router;