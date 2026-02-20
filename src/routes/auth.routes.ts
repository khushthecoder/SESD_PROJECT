import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { asyncHandler } from "../utils/asyncHandler";
import { authenticate } from "../middlewares/auth";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(authController.register.bind(authController)));
authRouter.post("/login", asyncHandler(authController.login.bind(authController)));
authRouter.post("/refresh", asyncHandler(authController.refresh.bind(authController)));
authRouter.post("/logout", asyncHandler(authController.logout.bind(authController)));
authRouter.get("/me", authenticate, asyncHandler(authController.me.bind(authController)));
