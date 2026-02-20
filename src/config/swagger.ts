import { Express } from "express";
import swaggerUi from "swagger-ui-express";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "HealthSync API",
    version: "1.0.0",
    description: "Smart Clinic & Patient Management System"
  },
  servers: [{ url: "/api/v1" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": { post: { summary: "Register a new user", tags: ["auth"] } },
    "/auth/login": { post: { summary: "Login", tags: ["auth"] } },
    "/auth/refresh": { post: { summary: "Refresh access token", tags: ["auth"] } },
    "/auth/logout": { post: { summary: "Logout", tags: ["auth"] } },
    "/patients": { get: { summary: "List patients", tags: ["patients"] }, post: { summary: "Create patient", tags: ["patients"] } },
    "/patients/{id}": { get: { summary: "Get patient", tags: ["patients"] } },
    "/doctors": { get: { summary: "List doctors", tags: ["doctors"] }, post: { summary: "Create doctor", tags: ["doctors"] } },
    "/doctors/{id}/schedule": { post: { summary: "Set weekly schedule", tags: ["doctors"] } },
    "/doctors/{id}/slots": { get: { summary: "Available time slots", tags: ["doctors"] } },
    "/appointments": { get: { summary: "List appointments", tags: ["appointments"] }, post: { summary: "Book appointment", tags: ["appointments"] } },
    "/appointments/{id}/status": { patch: { summary: "Transition appointment state", tags: ["appointments"] } }
  }
};

export function mountSwagger(app: Express): void {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.get("/api/openapi.json", (_req, res) => res.json(spec));
}
