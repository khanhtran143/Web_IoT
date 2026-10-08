import { Router } from "express";
import { DeviceController } from "../controllers/device.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get("/", DeviceController.getAll);
router.get("/:id", DeviceController.getById);
router.put("/:id/status", authenticateJWT, DeviceController.updateStatus);

export default router;
