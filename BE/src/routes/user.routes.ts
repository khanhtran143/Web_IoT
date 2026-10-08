import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", authenticateJWT, UserController.getMe);
router.put("/me", authenticateJWT, UserController.updateMe);

export default router;
