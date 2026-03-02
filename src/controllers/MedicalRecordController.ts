import { Request, Response, NextFunction } from "express";
import { MedicalRecordService } from "../services/MedicalRecordService";
import { asyncHandler } from "../utils/asyncHandler";

const medicalRecordService = new MedicalRecordService();

export class MedicalRecordController {
  static createRecord = asyncHandler(async (req: Request, res: Response) => {
    const record = await medicalRecordService.createRecord(req.body);
    res.status(201).json({ success: true, data: record });
  });

  static getRecord = asyncHandler(async (req: Request, res: Response) => {
    const record = await medicalRecordService.getRecordById(req.params.id);
    res.json({ success: true, data: record });
  });

  static getPatientHistory = asyncHandler(async (req: Request, res: Response) => {
    const records = await medicalRecordService.getPatientHistory(req.params.patientId);
    res.json({ success: true, data: records });
  });

  static updateRecord = asyncHandler(async (req: Request, res: Response) => {
    const record = await medicalRecordService.updateRecord(req.params.id, req.body);
    res.json({ success: true, data: record });
  });

  static getDoctorRecords = asyncHandler(async (req: Request, res: Response) => {
    const records = await medicalRecordService.getRecordsByDoctor(req.params.doctorId);
    res.json({ success: true, data: records });
  });
}
