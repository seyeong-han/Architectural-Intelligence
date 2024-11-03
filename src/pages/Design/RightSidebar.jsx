import React, { useState, useRef } from "react";
import ChatPanel from "./ChatPanel";

export default function RightSidebar({
  loading,
  messages,
  handleSendMessage,
  tools,
  selectedTool,
  handleToolClick,
  handleFileChange,
  handleResetLines,
}) {
  const fileInputRef = useRef(null);

  const handleToolAction = (toolId) => {
    handleToolClick(toolId);
    if (toolId === "upload") {
      fileInputRef.current?.click();
    } else if (toolId === "reset") {
      handleResetLines();
    }
  };

  return (
    <div className="w-80 bg-white shadow-md flex flex-col mr-4 mt-4 mb-4 rounded-3xl">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Tools</h3>
        <div className="flex justify-between px-4">
          {tools.map(({ id, icon: Icon, name, tooltip }) => (
            <button
              key={id}
              onClick={() => handleToolAction(id)}
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
