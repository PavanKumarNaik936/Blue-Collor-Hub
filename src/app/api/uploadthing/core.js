// app/api/uploadthing/core.js
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "10MB" } }) // handles profile + cover
    .onUploadComplete(async ({ file }) => {
      console.log("Image uploaded:", file.url);
    }),

  videoUploader: f({ video: { maxFileSize: "100MB" } }) // handles intro videos
    .onUploadComplete(async ({ file }) => {
      console.log("Video uploaded:", file.url);
    }),
};
