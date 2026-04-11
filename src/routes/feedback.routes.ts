import { Router } from "express";
import { FeedbackController } from "../controllers/FeedbackController";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);

router.post("/", FeedbackController.submit);
router.get("/doctor/:doctorId", FeedbackController.getDoctorRatings);
router.get("/appointment/:appointmentId", FeedbackController.getAppointmentFeedback);
router.delete("/:id", FeedbackController.deleteFeedback);

export default router;
