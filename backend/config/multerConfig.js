import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const multerStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "cbym/misc";
    let allowedFormats = ["jpg", "jpeg", "png", "gif"];
    let resource_type = "image";
    let transformation = [];

    if (file.fieldname === "logo") {
      folder = "cbym/logos";
      transformation = [{ width: 500, height: 500, crop: "limit" }];
    } else if (file.fieldname === "images") {
      folder = "cbym/hero";
    } else if (file.fieldname === "aboutImage") {
      folder = "cbym/about";
    } else if (file.fieldname === "gallery") {
      folder = "cbym/gallery";
    } else if (file.fieldname === "CustomPhoto") {
      folder = "cbym/CustomPhoto";
    } else if (file.fieldname === "paymentQR") {
      folder = "cbym/paymentQR";
    } else if (file.fieldname === "paymentSS") {
      folder = "cbym/paymentSS";
    } else if (file.fieldname === "memberPhoto") {
      folder = "cbym/members"; // ✅ member-specific folder
      transformation = [{ width: 600, height: 600, crop: "fill", gravity: "face" }];
    }

    return {
      folder,
      allowed_formats: allowedFormats,
      resource_type,
      transformation,
    };
  },
});

export default multerStorage;