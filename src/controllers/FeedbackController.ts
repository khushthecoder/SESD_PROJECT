import { Request, Response } from "express";
import { FeedbackService } from "../services/FeedbackService";
import { asyncHandler } from "../utils/asyncHandler";

const feedbackService = new FeedbackService();

export class FeedbackController {
  static submit = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const feedback = await feedbackService.submitFeedback({ ...req.body, patientId: userId });
    res.status(201).json({ success: true, data: feedback });
  });

  static getDoctorRatings = asyncHandler(async (req: Request, res: Response) => {
    const ratings = await feedbackService.getDoctorRatings(req.params.doctorId);
    res.json({ success: true, data: ratings });
  });

  static getAppointmentFeedback = asyncHandler(async (req: Request, res: Response) => {
    const feedback = await feedbackService.getAppointmentFeedback(req.params.appointmentId);
    res.json({ success: true, data: feedback });
  });

  static deleteFeedback = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const result = await feedbackService.deleteFeedback(req.params.id, userId);
    res.json({ success: true, data: result });
  });
}
