import React, { useState } from "react";
import {
  Files,
  Settings,
  DollarSign,
  FolderOpen,
  ShoppingBag,
  Home,
  Pen,
  Square,
  Paintbrush,
  Eraser,
  MessageCircle,
  Send,
} from "lucide-react";
export default function Editor() {
  const [prompt, setPrompt] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [activeTab, setActiveTab] = useState("edit");
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-6">
        {[Files, Settings, DollarSign, FolderOpen, ShoppingBag, Home].map(
          (Icon, index) => (
            <button key={index} className="p-2 rounded-lg hover:bg-gray-100">
              <Icon className="h-6 w-6 text-gray-600" />
            </button>
          )
        )}
      </div>
      {/* Main Content */}
      <div className="flex-grow flex flex-col">
        {/* Image Area */}
        <div className="flex-grow bg-white m-4 rounded-lg shadow-md flex items-center justify-center">
          <div className="text-gray-400">
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
            <p className="mt-2 text-center">Upload or generate an image</p>
          </div>
        </div>
        {/* Bottom Thumbnails */}
        <div className="h-24 bg-white mx-4 mb-4 rounded-lg shadow-md flex items-center px-4 space-x-4 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center"
            >
              <Square className="h-8 w-8 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
      {/* Right Sidebar */}
      <div className="w-80 bg-white shadow-md flex flex-col">
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === "edit" ? "bg-gray-100 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("edit")}
          >
            Edit
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === "chat" ? "bg-gray-100 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("chat")}
          >
            Chat
          </button>
        </div>
        {activeTab === "edit" ? (
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
        ) : (
          <div className="flex-grow flex flex-col">
            <div className="flex-grow p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <p className="text-sm">
                    Welcome! How can I assist you with your renovation design
                    today?
                  </p>
                </div>
                {/* Chat messages would be rendered here */}
              </div>
            </div>
            <div className="p-4 border-t">
              <textarea
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full p-2 border rounded-md mb-2 resize-none"
                rows={3}
              />
              <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </button>
            </div>
          </div>
        )}
        {/* Prompt Input (always visible) */}
        <div className="p-4 border-t flex items-center">
          <input
            type="text"
            placeholder="Enter prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-grow mr-2 p-2 border rounded-md"
          />
          <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
