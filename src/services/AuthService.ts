import crypto from "crypto";
import { prisma } from "../config/prisma";
import { Role } from "../models/enums/role.enum";
import { UserFactory } from "../patterns/factory/UserFactory";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { badRequest, conflict, unauthorized } from "../utils/httpError";

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  licenseNumber?: string;
  specialization?: string;
  consultationFee?: number;
}

const sha256 = (v: string) => crypto.createHash("sha256").update(v).digest("hex");

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw conflict("email already registered");

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        role: input.role,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone
      }
    });

    switch (input.role) {
      case Role.PATIENT:
        await prisma.patient.create({ data: { userId: user.id } });
        break;
      case Role.DOCTOR:
        if (!input.licenseNumber || !input.specialization) {
          throw badRequest("licenseNumber and specialization required for doctor");
        }
        await prisma.doctor.create({
          data: {
            userId: user.id,
            licenseNumber: input.licenseNumber,
            specialization: input.specialization,
            consultationFee: input.consultationFee ?? 500
          }
        });
        break;
      case Role.ADMIN:
        await prisma.admin.create({ data: { userId: user.id } });
        break;
      case Role.RECEPTIONIST:
        await prisma.receptionist.create({ data: { userId: user.id } });
        break;
    }

    const domain = UserFactory.create({
      role: input.role,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      licenseNumber: input.licenseNumber ?? "",
      specialization: input.specialization ?? "",
      consultationFee: input.consultationFee ?? 0
    } as never);

    const tokens = await this.issueTokens(user.id, user.role as Role, user.email);
    return { user: domain.toJSON(), ...tokens };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) throw unauthorized("invalid credentials");
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw unauthorized("invalid credentials");

    const tokens = await this.issueTokens(user.id, user.role as Role, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      ...tokens
    };
  }

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw unauthorized("invalid refresh token");
    }
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: sha256(refreshToken) } });
    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw unauthorized("refresh token not recognized");
    }
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.active) throw unauthorized();

    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
    return this.issueTokens(user.id, user.role as Role, user.email);
  }

  async logout(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: sha256(refreshToken) } });
    if (stored && !stored.revoked) {
      await prisma.refreshToken.update({ where: { id: stored.id }, data: { revoked: true } });
    }
  }

  private async issueTokens(userId: string, role: Role, email: string) {
    const accessToken = signAccessToken({ sub: userId, role, email });
    const jti = crypto.randomUUID();
    const refreshToken = signRefreshToken({ sub: userId, jti });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { userId, tokenHash: sha256(refreshToken), expiresAt }
    });
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
