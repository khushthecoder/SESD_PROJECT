import { Router } from "express";
import { appointmentController } from "../controllers/AppointmentController";
import { authenticate, requireRole } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { Role } from "../models/enums/role.enum";

export const appointmentsRouter = Router();

appointmentsRouter.use(authenticate);

appointmentsRouter.get("/mine", asyncHandler(appointmentController.mine.bind(appointmentController)));
appointmentsRouter.get(
  "/",
  requireRole(Role.ADMIN, Role.RECEPTIONIST, Role.DOCTOR),
  asyncHandler(appointmentController.listAll.bind(appointmentController))
);
appointmentsRouter.post(
  "/for-patient",
  requireRole(Role.RECEPTIONIST, Role.ADMIN),
  asyncHandler(appointmentController.bookForPatient.bind(appointmentController))
);
appointmentsRouter.get("/:id", asyncHandler(appointmentController.getOne.bind(appointmentController)));

appointmentsRouter.post(
  "/",
  requireRole(Role.PATIENT, Role.RECEPTIONIST),
  asyncHandler(appointmentController.book.bind(appointmentController))
);
appointmentsRouter.patch(
  "/:id/status",
  requireRole(Role.DOCTOR, Role.RECEPTIONIST, Role.ADMIN, Role.PATIENT),
  asyncHandler(appointmentController.transition.bind(appointmentController))
);
appointmentsRouter.patch(
  "/:id/reschedule",
  requireRole(Role.PATIENT, Role.RECEPTIONIST),
  asyncHandler(appointmentController.reschedule.bind(appointmentController))
);
