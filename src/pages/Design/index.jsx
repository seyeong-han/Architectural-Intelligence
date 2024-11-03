// ChatTestPage.js
import React, { useState, useEffect } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";
import axios from "axios";

const INITIAL_MESSAGE = "Hello";
const API_BASE_URL = "http://localhost:5000/api";

const generateChatResponse = async (userPrompt) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/generate`, {
      model: "llama3.2",
      messages: [
        {
          role: "system",
          content:
            "You are a virtual assistant specializing in home remodeling and design. Your role is to understand the user's requests and respond accordingly. " +
            "Based on the user's input, determine one of the following intentions: " +
            "- 'segment' if the user is looking to generate a new room style or overall aesthetic. " +
            "- 'inpaint' if the user wants to modify or replace a specific item or area within the existing space. " +
            "- 'response' if the user is asking a general question, engaging in conversation, or needs clarification. " +
            'Your response should always be in JSON format as follows: { "intention": "<intention>", "message": "<response text that addresses the user\'s request>" }. ' +
            "Keep your response concise and under 50 words, focusing on clear, specific suggestions or answers.",
        },
        { role: "user", content: userPrompt },
      ],
      stream: false,
    });
    console.log("data: ", data);

    return JSON.parse(data.message.content);
  } catch (error) {
    console.error("Error communicating with chat API:", error);
    throw new Error("Failed to generate chat response");
  }
};

export default function ChatTestPage() {
  const [loading, setLoading] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [imageItems, setImageItems] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [messages, setMessages] = useState([]);

  const seed = Math.floor(Math.random() * 100) + 1;

  useEffect(() => {
    const handleFirstVisit = async () => {
      if (isFirstVisit) {
        await handleSendMessage("Hello");
        setIsFirstVisit(false);
      }
    };

    handleFirstVisit();
    console.log("imageItems: ", imageItems);
  }, []);

  const generateStyle = async (prompt, roomType) => {
    setLoading(true);
    console.log("generating style...");
  };

  const addBotMessages = (messages) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      ...messages.map((msg) => ({ ...msg, sender: "bot" })),
    ]);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to the chat
    if (!isFirstVisit) {
      setMessages([
        ...messages,
        { content: message, contentType: "PlainText", sender: "user" },
      ]);
    }

    // Send message to the chatbot
    console.log("sending message...");
  };

  const handleFileUpload = async (files) => {
    const awsPaths = await Promise.all(files.map((file) => uploadImage(file)));
    const newImages = files.map((file, index) => ({
      imageURL: URL.createObjectURL(file),
      file: file,
      awsPath: awsPaths[index],
      generated: [
        {
          src: URL.createObjectURL(file),
          alt: "original image",
        },
      ],
      genCurrentIndex: 0,
      roomType: "",
      isExample: false,
    }));

    setImageItems((prevItems) => {
      const updatedImageItems = [...prevItems, ...newImages];
      setCurrentImageIndex(updatedImageItems.length - 1);

      setMessages([
        ...messages,
        {
          content: `We successfully uploaded ${files.length} image(s)`,
          sender: "bot",
        },
      ]);

      return updatedImageItems;
    });
  };

  const handleFileChange = async (event) => {
    const { files } = event.target;
    if (!files || files.length === 0) {
      return;
    }
    await handleFileUpload(Array.from(files));
  };

  return (
    <div className="flex h-screen w-full bg-gray-100">
      <LeftSidebar />
      <MainContent
        handleFileChange={handleFileChange}
        imageItems={imageItems}
        setImageItems={setImageItems}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
      />
      <RightSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messages={messages}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
