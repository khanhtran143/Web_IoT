import { Router } from "express";
import { SensorController } from "../controllers/sensor.controller";

const router = Router();

router.get("/", SensorController.getAll);
router.get("/latest", SensorController.getLatest);
router.get("/data", SensorController.getData);
router.get("/:id", SensorController.getById);

export default router;
