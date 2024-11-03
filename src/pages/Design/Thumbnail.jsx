import React from "react";

export default function Thumbnail({ imageItems, setCurrentImageIndex }) {
  return (
    <div className="h-48 bg-white mx-4 mb-4 rounded-3xl shadow-md flex items-center px-4 space-x-4 overflow-x-auto">
      {imageItems.length > 0 &&
        imageItems.map((imageItem, i) => (
          <div
            key={i}
            className="w-32 h-32 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center cursor-pointer"
            onClick={() => setCurrentImageIndex(i)}
          >
            <img
              src={imageItem.base64Data}
              alt={`Generated ${i}`}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
    </div>
  );
}
