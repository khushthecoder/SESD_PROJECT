import { Router } from "express";
import { MedicalRecordController } from "../controllers/MedicalRecordController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/", MedicalRecordController.createRecord);
router.get("/:id", MedicalRecordController.getRecord);
router.put("/:id", MedicalRecordController.updateRecord);
router.get("/patient/:patientId", MedicalRecordController.getPatientHistory);
router.get("/doctor/:doctorId", MedicalRecordController.getDoctorRecords);

export default router;
