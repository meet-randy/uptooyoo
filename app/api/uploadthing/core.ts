import { createUploadthing, type FileRouter } from "uploadthing/next";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  thumbnailUploader: f({ 
    image: { 
      maxFileSize: "16MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async () => {
      const self = await currentUser();

      return { user: self }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.stream.update({
        where: {
          userId: metadata.user?.id,
        },
        data: {
          thumbnailUrl: file.url,
        },
      });

      return { fileUrl: file.url };
    })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;