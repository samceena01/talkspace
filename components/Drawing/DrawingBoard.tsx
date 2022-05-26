import { Container } from "@mui/system";
import { useRouter } from "next/router";
import React from "react";
import { routes } from "../../lib/utils";
import { BoardCanvas, SaveData } from "./BoardCanvas";

const DrawingBoard = () => {
  const router = useRouter();

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  const upload = async (data: string, ext: string) => {
    return fetch(`/api/upload`, {
      method: "POST",
      body: JSON.stringify({
        data,
        ext,
      }),
    })
      .then((res) => res.json())
      .then((res) => res.result);
  };

  const handleSaveChanges = async ({
    isPublic,
    imageDataUrl,
    duration,
    createdAt,
    videoDataUrl,
  }: SaveData) => {
    try {
      const [imageFileName, videoFileName] = await Promise.all([
        upload(imageDataUrl, "png"), // upload image
        upload(videoDataUrl, "mp4"), // upload video
      ]);

      await fetch("/api/drawings", {
        method: "POST",
        body: JSON.stringify({
          imageFileName,
          videoFileName,
          isPublic,
          duration,
          createdAt,
        }),
      });

      router.push(routes.home);
    } catch (error) {
      // TODO: notify save failed
    }
  };

  return (
    <Container>
      <BoardCanvas onSave={handleSaveChanges} />
    </Container>
  );
};

export default DrawingBoard;
