// MainContent.js
import React from "react";
import Thumbnail from "./Thumbnail";

export default function MainContent({
  handleFileChange,
  imageItems,
  setImageItems,
  currentImageIndex,
  setCurrentImageIndex,
}) {
  return (
    <div className="flex-grow flex flex-col">
      {/* Image Area */}
      <div className="flex-grow bg-white m-4 rounded-3xl shadow-md flex items-center justify-center">
        {imageItems.length > 0 ? (
          <img
            src={imageItems[currentImageIndex].base64Data}
            alt="Uploaded"
            className="max-w-full max-h-full"
          />
        ) : (
          <>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
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
              <p className="mt-2 text-center">Upload an image</p>
            </label>
          </>
        )}
      </div>

      {/* Bottom Thumbnails */}
      <Thumbnail
        imageItems={imageItems}
        setCurrentImageIndex={setCurrentImageIndex}
      />
    </div>
  );
}
