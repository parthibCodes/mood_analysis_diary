import { Router } from "express";
const router = Router();
import { addEntry, getAllEntries , editEntries, deleteEntries } from "../controllers/journal.controllers.js";
import { userAuth } from "../middlewares/user.auth.js";

router.route("/addEntry").post(userAuth,addEntry);
router.route("/getAllEntries/:date").get(userAuth,getAllEntries);
router.route("/edit/:journalId").patch(userAuth,editEntries);
router.route("/deleteJournal/:journalId").delete(userAuth,deleteEntries);

export default router;