import prisma from "@/config/database";
import {
  ProfileResponse,
  profileSchema,
  UpdateProfileRequest,
} from "./users.models";
import { HTTPException } from "hono/http-exception";
import { uploadToCloudinary } from "@/utils/uploader";

export class UsersServices {
  static async getProfile(userId: string): Promise<ProfileResponse> {
    // get profile by userId
    const profile = await prisma.user.findUnique({
      where: { id: userId },
    });

    // if profile not found, throw 404
    if (!profile) {
      throw new HTTPException(404, { message: "Profile not found" });
    }

    // return parsed profile
    return profileSchema.parse(profile);
  }

  static async updateProfile(
    userId: string,
    request: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    // upload new image to cloudinary if file exists
    if (request.file) {
      const buffer = Buffer.from(await request.file.arrayBuffer());
      const result = await uploadToCloudinary(buffer);
      request.image = result.secure_url;
    }

    // update user profile
    const update = await prisma.user.update({
      where: { id: userId },
      data: {
        name: request.name,
        image: request.image,
      },
    });

    // return parsed updated profile
    return profileSchema.parse(update);
  }
}
