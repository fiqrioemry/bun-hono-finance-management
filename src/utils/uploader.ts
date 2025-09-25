import { HTTPException } from "hono/http-exception";
import cloudinary from "@/config/cloudinary";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

async function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: process.env.CLOUD_FOLDER,
            transformation: [
              {
                width: 500,
                height: 500,
                crop: "limit",
                format: "webp",
              },
            ],
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("No result from Cloudinary"));
            resolve(result);
          }
        )
        .end(buffer);
    });

    return result;
  } catch (error: any) {
    console.error(error);
  }
}

async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    const fileName = imageUrl.split("/").pop();
    if (!fileName) throw new Error("Invalid image URL");

    const publicId = `${process.env.CLOUD_FOLDER}/${fileName.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error: any) {
    console.error(error);
  }
}

export { uploadToCloudinary, deleteFromCloudinary };
