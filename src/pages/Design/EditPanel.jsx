import React from "react";
import { Pen, Paintbrush, Square, Eraser } from "lucide-react";

const EditPanel = () => {
  return (
    <div className="flex-grow flex flex-col">
      <div className="p-4 border-b">
        <button className="w-full mb-2 py-2 px-4 border rounded-md hover:bg-gray-50 flex items-center justify-center">
          <Pen className="h-4 w-4 mr-2" /> Draw
        </button>
        <div className="flex space-x-2">
          {[Paintbrush, Square, Eraser].map((Icon, index) => (
            <button
              key={index}
              className="p-2 border rounded-md hover:bg-gray-50"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {/* Additional editing options can be added here */}
      </div>
    </div>
  );
};

export default EditPanel;
