import { Router } from "express";
import { ReportController } from "../controllers/ReportController";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);

router.get("/appointments", ReportController.getAppointmentSummary);
router.get("/revenue", ReportController.getRevenueSummary);
router.get("/departments", ReportController.getDepartmentStats);
router.get("/doctor/:doctorId/performance", ReportController.getDoctorPerformance);
router.get("/demographics", ReportController.getPatientDemographics);

export default router;
