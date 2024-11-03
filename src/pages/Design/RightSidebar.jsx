import React from "react";
import EditPanel from "./EditPanel";
import ChatPanel from "./ChatPanel";

export default function RightSidebar({
  activeTab,
  setActiveTab,
  messages,
  handleSendMessage,
}) {
  return (
    <div className="w-80 bg-white shadow-md flex flex-col mr-4 mt-4 mb-4 rounded-3xl">
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 ${
            activeTab === "chat" ? "bg-gray-100 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-2 px-4 ${
            activeTab === "edit" ? "bg-gray-100 font-semibold" : ""
          }`}
          onClick={() => setActiveTab("edit")}
        >
          Edit
        </button>
      </div>

      {activeTab === "edit" ? (
        <EditPanel />
      ) : (
        <ChatPanel messages={messages} handleSendMessage={handleSendMessage} />
      )}
    </div>
  );
}
