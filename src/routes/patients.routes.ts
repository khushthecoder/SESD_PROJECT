import { Router } from "express";
import { patientController } from "../controllers/PatientController";
import { authenticate, requireRole } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { Role } from "../models/enums/role.enum";

export const patientsRouter = Router();

patientsRouter.use(authenticate);

patientsRouter.get("/me", asyncHandler(patientController.me.bind(patientController)));
patientsRouter.get("/", requireRole(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST), asyncHandler(patientController.list.bind(patientController)));
patientsRouter.get("/:id", requireRole(Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST), asyncHandler(patientController.getOne.bind(patientController)));
patientsRouter.patch("/:id", asyncHandler(patientController.update.bind(patientController)));
