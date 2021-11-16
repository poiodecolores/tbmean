import express from "express";
import user from "../controllers/user.js";
const router = express.Router();

router.post("/registerUser", user.registerUser);
router.post("/registerAdminUser", user.registerAdminUser);
router.post("/login", user.login)
router.get("/listUsers", user.listUsers);
router.get("/findUser/:_id", user.findUser);
router.put("/updateUser", user.updateUser);
router.delete("/deleteUser/:_id", user.deleteUser);

export default router;
