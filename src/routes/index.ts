import { Router } from "express";
import { authRouter } from "./auth.routes";
import { patientsRouter } from "./patients.routes";
import { doctorsRouter } from "./doctors.routes";
import { appointmentsRouter } from "./appointments.routes";
import { prescriptionsRouter } from "./prescriptions.routes";
import { adminRouter } from "./admin.routes";
import { AppointmentSubject } from "../patterns/observer/AppointmentSubject";
import { NotifyObserver } from "../patterns/observer/NotifyObserver";

AppointmentSubject.instance().subscribe(new NotifyObserver());

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/patients", patientsRouter);
apiRouter.use("/doctors", doctorsRouter);
apiRouter.use("/appointments", appointmentsRouter);
apiRouter.use("/prescriptions", prescriptionsRouter);
apiRouter.use("/admin", adminRouter);
