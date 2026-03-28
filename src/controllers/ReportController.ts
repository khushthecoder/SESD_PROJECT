import { Request, Response } from "express";
import { ReportService } from "../services/ReportService";
import { asyncHandler } from "../utils/asyncHandler";

const reportService = new ReportService();

export class ReportController {
  static getAppointmentSummary = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const summary = await reportService.getAppointmentSummary(
      new Date(startDate as string), new Date(endDate as string)
    );
    res.json({ success: true, data: summary });
  });

  static getRevenueSummary = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;
    const summary = await reportService.getRevenueSummary(
      new Date(startDate as string), new Date(endDate as string)
    );
    res.json({ success: true, data: summary });
  });

  static getDepartmentStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await reportService.getDepartmentStats();
    res.json({ success: true, data: stats });
  });

  static getDoctorPerformance = asyncHandler(async (req: Request, res: Response) => {
    const { doctorId } = req.params;
    const { month, year } = req.query;
    const performance = await reportService.getDoctorPerformance(doctorId, Number(month), Number(year));
    res.json({ success: true, data: performance });
  });

  static getPatientDemographics = asyncHandler(async (_req: Request, res: Response) => {
    const demographics = await reportService.getPatientDemographics();
    res.json({ success: true, data: demographics });
  });
}
