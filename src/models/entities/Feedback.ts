export interface IFeedback {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: Date;
}

export class Feedback implements IFeedback {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  isAnonymous: boolean;
  createdAt: Date;

  constructor(data: IFeedback) {
    if (data.rating < 1 || data.rating > 5) throw new Error("Rating must be between 1 and 5");
    this.id = data.id;
    this.patientId = data.patientId;
    this.doctorId = data.doctorId;
    this.appointmentId = data.appointmentId;
    this.rating = data.rating;
    this.comment = data.comment;
    this.isAnonymous = data.isAnonymous;
    this.createdAt = data.createdAt;
  }

  getSentiment(): "positive" | "neutral" | "negative" {
    if (this.rating >= 4) return "positive";
    if (this.rating === 3) return "neutral";
    return "negative";
  }

  getStarDisplay(): string {
    return "★".repeat(this.rating) + "☆".repeat(5 - this.rating);
  }

  toPublicView(): Omit<IFeedback, "patientId"> & { patientId?: string } {
    const view: any = { ...this };
    if (this.isAnonymous) delete view.patientId;
    return view;
  }
}
