// app/api/uploadthing/route.js (Next.js App Router)
import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageAndVideo: f
    .fileTypes(["image", "video"]) // allow images and videos
    .maxSize("64MB") // max file size
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file.url);
      // TODO: save file.url to your database
    }),
};

export const { middleware, config } = f;
