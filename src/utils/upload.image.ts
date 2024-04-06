import cloudinary from "./cloudinary";
import crypto from "crypto";

export const uploadImage = async (file: any) => {
  try {
    const randomBytes = crypto.randomBytes(16);
    const randomString = randomBytes.toString("hex");
    const timestamp = Date.now();
    const publicId = `${randomString}+${file.name}+${timestamp}`;

    const dataUri = `data:${file.mimetype};base64,${file.data.toString(
      "base64"
    )}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataUri,
        {
          public_id: publicId,
          resource_type: "image",
          overwrite: true,
          invalidate: true,
          folder: "devices",
        },
        (err: any, res: any) => {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: res.public_id,
              url: res.secure_url,
            });
          }
        }
      );
    });
  } catch (error: any) {
    throw new Error("Error occurred during image upload: " + error.message);
  }
};

export const deleteImage = async (id: any) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(id, (err: any, _res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            success: "Image SuccessFully Removed",
          });
        }
      });
    });
  } catch (error: any) {
    throw new Error("Error occurred during image upload: " + error.message);
  }
};
