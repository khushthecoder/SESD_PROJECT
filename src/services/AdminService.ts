import { prisma } from "../config/prisma";
import { AppointmentStatus } from "../models/enums/appointment.enum";
import { cacheGet, cacheSet } from "../config/redis";

export interface DashboardStats {
  totals: { users: number; patients: number; doctors: number; appointments: number };
  appointmentsByStatus: Record<string, number>;
  revenueToday: number;
  revenue30Days: number;
  topDoctors: Array<{ doctorId: string; name: string; count: number }>;
}

export class AdminService {
  async stats(): Promise<DashboardStats> {
    const cached = await cacheGet<DashboardStats>("admin:stats");
    if (cached) return cached;

    const [users, patients, doctors, appts] = await Promise.all([
      prisma.user.count(),
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count()
    ]);

    const groups = await prisma.appointment.groupBy({
      by: ["status"],
      _count: { _all: true }
    });
    const byStatus: Record<string, number> = {};
    for (const s of Object.values(AppointmentStatus)) byStatus[s] = 0;
    for (const g of groups) byStatus[g.status] = g._count._all;

    const now = new Date();
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const thirtyAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [revToday, rev30] = await Promise.all([
      prisma.appointment.aggregate({
        _sum: { fee: true },
        where: { createdAt: { gte: startOfDay }, status: { not: AppointmentStatus.CANCELLED } }
      }),
      prisma.appointment.aggregate({
        _sum: { fee: true },
        where: { createdAt: { gte: thirtyAgo }, status: { not: AppointmentStatus.CANCELLED } }
      })
    ]);

    const topGroups = await prisma.appointment.groupBy({
      by: ["doctorId"],
      _count: { _all: true },
      orderBy: { _count: { doctorId: "desc" } },
      take: 5
    });
    const docInfo = await prisma.doctor.findMany({
      where: { id: { in: topGroups.map((t) => t.doctorId) } },
      include: { user: { select: { firstName: true, lastName: true } } }
    });
    const topDoctors = topGroups.map((t) => {
      const d = docInfo.find((x) => x.id === t.doctorId);
      return {
        doctorId: t.doctorId,
        name: d?.user ? `${d.user.firstName} ${d.user.lastName}` : t.doctorId,
        count: t._count._all
      };
    });

    const stats: DashboardStats = {
      totals: { users, patients, doctors, appointments: appts },
      appointmentsByStatus: byStatus,
      revenueToday: Number(revToday._sum.fee ?? 0),
      revenue30Days: Number(rev30._sum.fee ?? 0),
      topDoctors
    };
    await cacheSet("admin:stats", stats, 60);
    return stats;
  }

  async listUsers(skip = 0, take = 50) {
    return prisma.user.findMany({
      skip,
      take: Math.min(take, 200),
      orderBy: { createdAt: "desc" },
      select: {
        id: true, email: true, role: true, firstName: true, lastName: true, active: true, createdAt: true
      }
    });
  }

  async setUserActive(userId: string, active: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { active },
      select: { id: true, active: true }
    });
  }
}

export const adminService = new AdminService();
