import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Line } from "react-konva";
import Thumbnail from "./Thumbnail";

const useImage = (src) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!src) return;

    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  return image;
};

export default function MainContent({
  handleFileChange,
  imageItems,
  setImageItems,
  currentImageIndex,
  setCurrentImageIndex,
  selectedTool,
  stageRef,
  linesLayerRef,
  lines,
  setLines,
  setIsDrawn,
}) {
  const isDrawing = useRef(false);
  const currentImage = useImage(imageItems[currentImageIndex]?.base64Data);

  useEffect(() => {
    setIsDrawn(true);
  }, [isDrawing]);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawn(true);
    setLines([
      ...lines,
      {
        tool: selectedTool,
        points: [pos.x, pos.y],
        opacity: selectedTool === "brush" ? 0.3 : 1,
      },
    ]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    setIsDrawn(true);
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];

    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    setIsDrawn(true);
  };

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex-grow bg-white m-4 rounded-3xl shadow-md flex items-center justify-center">
        {imageItems.length > 0 && currentImage ? (
          <Stage
            ref={stageRef}
            width={832}
            height={640}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              <Image image={currentImage} width={832} height={640} />
            </Layer>

            <Layer ref={linesLayerRef}>
              {lines
                .filter((line) => line.tool === "brush")
                .map((line, i) => (
                  <Line
                    key={i}
                    points={line.points}
                    stroke="white"
                    strokeWidth={50}
                    opacity={0.3}
                    globalCompositeOperation="source-over"
                    lineCap="round"
                    lineJoin="round"
                  />
                ))}
            </Layer>
          </Stage>
        ) : (
          <>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
            <label
              htmlFor="file-upload"
              className="text-gray-400 cursor-pointer"
            >
              <svg
                className="h-24 w-24 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-center">Upload image(s)</p>
            </label>
          </>
        )}
      </div>

      <Thumbnail
        imageItems={imageItems}
        setCurrentImageIndex={setCurrentImageIndex}
      />
    </div>
  );
}
