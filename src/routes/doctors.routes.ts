import { Router } from "express";
import { doctorController } from "../controllers/DoctorController";
import { authenticate, requireRole } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { Role } from "../models/enums/role.enum";

export const doctorsRouter = Router();

doctorsRouter.get("/", asyncHandler(doctorController.list.bind(doctorController)));
doctorsRouter.get("/:id", asyncHandler(doctorController.getOne.bind(doctorController)));
doctorsRouter.get("/:id/slots", asyncHandler(doctorController.availableSlots.bind(doctorController)));

doctorsRouter.post(
  "/:id/schedule",
  authenticate,
  requireRole(Role.DOCTOR, Role.ADMIN),
  asyncHandler(doctorController.setSchedule.bind(doctorController))
);
doctorsRouter.patch(
  "/:id/fee",
  authenticate,
  requireRole(Role.DOCTOR, Role.ADMIN),
  asyncHandler(doctorController.updateFee.bind(doctorController))
);
