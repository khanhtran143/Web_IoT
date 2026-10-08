import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { UserService } from "../services/user.service";
import { sendSuccess, sendError } from "../utils/response";

export class UserController {
  static async getMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1; // Default demo fallback
      const user = await UserService.getProfile(userId);
      return sendSuccess(res, user, "Profile fetched successfully");
    } catch (error: any) {
      return sendError(res, error.message, 404, "NOT_FOUND");
    }
  }

  static async updateMe(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id || 1;
      const { full_name, student_id, class: className, major, avatar, github_url, figma_url, postman_url } = req.body;

      const updated = await UserService.updateProfile(userId, {
        full_name,
        student_id,
        class: className,
        major,
        avatar,
        github_url,
        figma_url,
        postman_url,
      });

      return sendSuccess(res, updated, "Profile updated successfully");
    } catch (error: any) {
      return sendError(res, error.message, 400, "UPDATE_FAILED");
    }
  }
}
