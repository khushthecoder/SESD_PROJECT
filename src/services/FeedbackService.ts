import { HttpError } from "../utils/httpError";
import { logger } from "../utils/logger";

interface FeedbackInput {
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  isAnonymous?: boolean;
}

export class FeedbackService {
  async submitFeedback(data: FeedbackInput) {
    if (data.rating < 1 || data.rating > 5) throw new HttpError(400, "Rating must be between 1 and 5");
    if (data.comment && data.comment.length > 500) throw new HttpError(400, "Comment must be 500 characters or less");
    logger.info(`Feedback submitted for appointment ${data.appointmentId}`);
    return { ...data, id: `fb_${Date.now()}`, isAnonymous: data.isAnonymous || false, createdAt: new Date() };
  }

  async getDoctorRatings(doctorId: string) {
    logger.info(`Fetching ratings for doctor ${doctorId}`);
    return { doctorId, averageRating: 0, totalReviews: 0, ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }

  async getAppointmentFeedback(appointmentId: string) {
    logger.info(`Fetching feedback for appointment ${appointmentId}`);
    return null;
  }

  async deleteFeedback(feedbackId: string, userId: string) {
    logger.info(`Feedback ${feedbackId} deleted by user ${userId}`);
    return { deleted: true };
  }
}
