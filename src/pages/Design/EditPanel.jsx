// LeftSidebar.js
import React from "react";
import {
  Files,
  Settings,
  DollarSign,
  FolderOpen,
  ShoppingBag,
  Home,
} from "lucide-react";

export default function LeftSidebar() {
  return (
    <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-6 rounded-3xl ml-4 mt-4 mb-4">
      {[Home, Files, Settings, DollarSign, FolderOpen, ShoppingBag].map(
        (Icon, index) => (
          <button key={index} className="p-2 rounded-lg hover:bg-gray-100">
            <Icon className="h-6 w-6 text-gray-600" />
          </button>
        )
      )}
    </div>
  );
}
