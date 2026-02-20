import { Router } from "express";
import { prescriptionController } from "../controllers/PrescriptionController";
import { authenticate, requireRole } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { Role } from "../models/enums/role.enum";

export const prescriptionsRouter = Router();

prescriptionsRouter.use(authenticate);

prescriptionsRouter.post(
  "/",
  requireRole(Role.DOCTOR),
  asyncHandler(prescriptionController.create.bind(prescriptionController))
);
prescriptionsRouter.get(
  "/by-appointment/:appointmentId",
  asyncHandler(prescriptionController.byAppointment.bind(prescriptionController))
);
