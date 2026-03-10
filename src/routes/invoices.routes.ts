import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/", InvoiceController.create);
router.post("/:id/pay", InvoiceController.processPayment);
router.get("/patient/:patientId", InvoiceController.getPatientInvoices);

export default router;
