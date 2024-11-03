import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import { Paintbrush, Square, Eraser } from "lucide-react";

const tools = [
  {
    id: "brush",
    icon: Paintbrush,
    name: "Brush",
    tooltip: "Draw with brush",
  },
  {
    id: "eraser",
    icon: Eraser,
    name: "Eraser",
    tooltip: "Erase parts of image",
  },
];

export default function RightSidebar({
  loading,
  messages,
  handleSendMessage,
  onToolSelect,
}) {
  const [selectedTool, setSelectedTool] = useState(tools[0].id);

  const handleToolClick = (toolId) => {
    setSelectedTool(toolId);
    onToolSelect?.(toolId);
  };

  return (
    <div className="w-80 bg-white shadow-md flex flex-col mr-4 mt-4 mb-4 rounded-3xl">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Drawing Tools
        </h3>
        <div className="flex space-x-3">
          {tools.map(({ id, icon: Icon, name, tooltip }) => (
            <button
              key={id}
              onClick={() => handleToolClick(id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                selectedTool === id
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50 text-gray-600"
              }`}
              title={tooltip}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatPanel
          loading={loading}
          messages={messages}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}
