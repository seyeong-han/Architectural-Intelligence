// LeftSidebar.js
import React from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-6 rounded-3xl ml-4 mt-4 mb-4">
      <button
        className="p-2 rounded-lg hover:bg-gray-100"
        onClick={handleHomeClick}
      >
        <Home className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
}
