import { Router } from "express";
import { adminController } from "../controllers/AdminController";
import { authenticate, requireRole } from "../middlewares/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { Role } from "../models/enums/role.enum";

export const adminRouter = Router();

adminRouter.use(authenticate, requireRole(Role.ADMIN));
adminRouter.get("/stats", asyncHandler(adminController.stats.bind(adminController)));
adminRouter.get("/users", asyncHandler(adminController.listUsers.bind(adminController)));
adminRouter.patch("/users/:id/active", asyncHandler(adminController.setActive.bind(adminController)));
