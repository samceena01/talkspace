import React, { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInMilliseconds,
} from "date-fns";

import { Controls } from "./Controls";

export type SaveData = {
  isPublic: boolean;
  duration: string;
  createdAt: number;
  imageDataUrl: string;
  videoDataUrl: string;
};

export type BoardCanvasProps = {
  onSave: (data: SaveData) => void;
};

export const BoardCanvas: FC<BoardCanvasProps> = (props: BoardCanvasProps) => {
  const defaultCanvasBrushColor = "#000";
  const [userIsDrawing, setUserIsDrawing] = useState<boolean>(false);
  const [starTimeToDraw, setStartTimeToDraw] = useState<Date>();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoChunks = useRef<Blob[]>([]);

  const get2DContext = () => canvasRef.current?.getContext("2d");

  const getCanvas = () => canvasRef.current as HTMLCanvasElement;

  const init = () => {
    const canvas = getCanvas();
    if (canvas) {
      const parentElement = canvas.parentElement;

      if (parentElement) {
        const { width, height } = parentElement.getBoundingClientRect();

        // handle retina displays
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }

      const canvas2DContext = get2DContext();

      if (canvas2DContext) {
        canvas2DContext.lineWidth = 6;
        canvas2DContext.lineCap = "butt";

        canvas2DContext.fillStyle = "#fff";
        canvas2DContext.fillRect(0, 0, canvas.width, canvas.height);

        canvas2DContext.strokeStyle = defaultCanvasBrushColor;
        canvas2DContext.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }
  };

  useEffect(() => {
    init();
    const canvas = getCanvas();
    if (canvas) {
      const videoStream = canvas.captureStream(25);
      setMediaRecorder(
        new MediaRecorder(videoStream, { mimeType: "video/webm" })
      );
    }
  }, []);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunks.current.push(event.data);
        }
      };
    }
  }, [mediaRecorder]);

  const stopRecorder = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  const startRecorder = (timeSlice = 1) => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      mediaRecorder.start(timeSlice);
    }
  };

  const dragStart = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas2DContext = get2DContext();
    if (canvas2DContext) {
      canvas2DContext.beginPath();
      canvas2DContext?.beginPath();
      canvas2DContext?.moveTo(
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY
      );
    }

    if (!starTimeToDraw) {
      setStartTimeToDraw(new Date());
    }

    setUserIsDrawing(true);
  };

  const dragEnd = () => {
    const canvas2DContext = get2DContext();
    canvas2DContext?.closePath();
    setUserIsDrawing(false);
  };

  const draw = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!userIsDrawing) {
      return;
    }

    startRecorder();

    const canvas2DContext = get2DContext();
    if (canvas2DContext) {
      canvas2DContext.lineTo(
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY
      );
      canvas2DContext.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = getCanvas();
    const canvas2DContext = get2DContext();
    if (canvas && canvas2DContext) {
      canvas2DContext.clearRect(0, 0, canvas.width, canvas.height);
      setUserIsDrawing(false);
      setStartTimeToDraw(new Date());

      stopRecorder();
    }
  };

  const handleBrushWidthChange = (value: number) => {
    const canvas2DContext = get2DContext();
    if (canvas2DContext) {
      canvas2DContext.lineWidth = value;
    }
  };

  function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  const getRecordedVideo = async () => {
    const blob = new Blob(videoChunks.current, { type: "video/webm" });
    const dataUrl = await blobToBase64(blob);

    return dataUrl;
  };

  const handleSave = async (isPublic: boolean) => {
    const canvas = getCanvas();

    // stop recording
    stopRecorder();

    if (canvas && starTimeToDraw) {
      const imageDataUrl = canvas.toDataURL();

      const endDrawingDate = new Date();
      const milliseconds = differenceInMilliseconds(
        endDrawingDate,
        starTimeToDraw
      );

      let duration = "0";
      if (milliseconds < 1000) {
        duration = milliseconds + "ms";
      } else if (milliseconds < 60000) {
        duration = differenceInSeconds(endDrawingDate, starTimeToDraw) + "s";
      } else if (milliseconds < 3600000) {
        duration = differenceInMinutes(endDrawingDate, starTimeToDraw) + "m";
      } else {
        duration = differenceInHours(endDrawingDate, starTimeToDraw) + "h";
      }

      const videoDataUrl = await getRecordedVideo();

      props.onSave({
        isPublic,
        imageDataUrl,
        duration,
        createdAt: endDrawingDate.getTime(),
        videoDataUrl,
      });
    }
  };

  const handleColorPicked = (color: string) => {
    const canvas2DContext = get2DContext();
    if (canvas2DContext) {
      canvas2DContext.strokeStyle = color;
    }
  };

  const handleEraserClicked = () => {
    const canvas2DContext = get2DContext();
    if (canvas2DContext) {
      canvas2DContext.strokeStyle = "#fff";
    }
  };

  console.log(mediaRecorder?.state === "inactive");
  return (
    <>
      <Controls
        onClear={clearCanvas}
        onBrushWidthChange={handleBrushWidthChange}
        onSaveChanges={handleSave}
        onEraserClicked={handleEraserClicked}
        onColorPicked={handleColorPicked}
      />
      <Box
        sx={{
          borderWidth: 2,
          borderColor: "#3d3d3d",
          borderStyle: "dashed",
          maxWidth: "100%",
          minHeight: 600,
          overflow: "hidden",
          cursor: "pointer",
        }}
      >
        <canvas
          style={{ cursor: "default" }}
          onMouseDown={dragStart}
          onMouseUp={dragEnd}
          onMouseMove={draw}
          ref={canvasRef}
        />
      </Box>
    </>
  );
};
