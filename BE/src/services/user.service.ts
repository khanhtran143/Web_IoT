import prisma from "../config/database";

export class UserService {
  static async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  static async updateProfile(
    userId: number,
    data: {
      full_name?: string;
      student_id?: string;
      class?: string;
      major?: string;
      avatar?: string;
      github_url?: string;
      figma_url?: string;
      postman_url?: string;
    }
  ) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password, ...safeUser } = updated;
    return safeUser;
  }
}
