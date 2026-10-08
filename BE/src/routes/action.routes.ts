import { Router } from "express";
import { ActionController } from "../controllers/action.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get("/", ActionController.getAll);
router.post("/", authenticateJWT, ActionController.createAction);

export default router;
