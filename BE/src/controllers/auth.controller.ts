import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/response";
import { AuthRequest } from "../middleware/auth.middleware";

const loginSchema = z.object({
  email: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, parsed.error.errors[0].message, 400, "VALIDATION_ERROR");
      }

      const { email, password } = parsed.data;
      const result = await AuthService.login(email, password);

      return sendSuccess(res, result, "Login successful");
    } catch (error: any) {
      return sendError(res, error.message || "Invalid credentials", 401, "AUTH_FAILED");
    }
  }

  static async logout(req: Request, res: Response) {
    return sendSuccess(res, { loggedOut: true }, "Logout successful");
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
      }

      const user = await AuthService.getMe(req.user.id);
      return sendSuccess(res, user, "User retrieved successfully");
    } catch (error: any) {
      return sendError(res, error.message, 404, "NOT_FOUND");
    }
  }
}
