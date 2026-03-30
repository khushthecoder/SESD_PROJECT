import { Request, Response, NextFunction } from "express";

type Role = "ADMIN" | "DOCTOR" | "PATIENT" | "RECEPTIONIST";

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (!userRole) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }
    next();
  };
};

export const requireAdmin = requireRole("ADMIN");
export const requireDoctor = requireRole("DOCTOR", "ADMIN");
export const requirePatient = requireRole("PATIENT", "ADMIN");
export const requireStaff = requireRole("ADMIN", "DOCTOR", "RECEPTIONIST");
