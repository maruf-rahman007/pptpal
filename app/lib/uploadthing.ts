import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers, // 👈 ADD THIS
} from "@uploadthing/react";

import type { OurFileRouter } from "../api/uploadthing/core";

// existing
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// 👇 ADD THIS
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
