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

  const addBotMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: crypto.randomUUID(),
        content: newMessage,
        sender: "bot",
      },
    ]);
  }, []);

  const handleSendMessage = useCallback(
    async (message) => {
      if (!message.trim()) return;

      setLoading(true);
      try {
        // Add user message to chaturrentImageIndex, setCurrentImageIndex] = useState(0);
  const [messages, setMessages] = useState([]);

  const addBotMessage = useCallback((newMessage) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: crypto.randomUUID(),
        content: newMessage,
        sender: "bot",
      },
    ]);
  }, []);
              id: crypto.randomUUID(),
              content: message,
              sender: "user",
            },
          ]);
        }

        console.log("imageItems: ", imageItems);

        // Only generate chat response if there's an image uploaded
        if (imageItems.length > 0) {
          const chatResponse = await generateChatResponse(message);

          console.log("chatResponse: ", chatResponse);

          if (chatResponse?.message) {
            const intention = chatResponse.intention;
            if (["segment", "inpaint"].includes(intention)) {
              await generateStyle(chatResponse.message, intention);
            } else if (intention === "response") {
              // If no intention, just add a basic bot message
              addBotMessage(chatResponse.message);
            } else {
              // If no valid response, just add a basic bot message
              addBotMessage(
                "I couldn't understand your request. Could you please rephrase it?"
              );
            }
          } else {
            // If no images uploaded, prompt user to upload an image
            addBotMessage(
              "Please upload an image first so I can help you style it!"
            );
          }
        } else {
          // If no images uploaded, prompt user to upload an image
          addBotMessage(
            "Please upload an image first so I can help you style it!"
          );
        }
      } catch (error) {
        console.error("Error in message handling:", error);
        addBotMessage(
          "I encountered an error processing your request. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [isFirstVisit, imageItems.length, addBotMessage]
  );



  const handleFileUpload = useCallback(
    async (files) => {
      try {
        const newImages = files.map((file) => ({
          id: crypto.randomUUID(),
          imageURL: URL.createObjectURL(file),
          file,
          generated: [
            {
              src: URL.createObjectURL(file),
              alt: "original image",
            },
          ],
          genCurrentIndex: 0,
          roomType: "",
        }));

        setImageItems((prevItems) => {
          const updatedItems = [...prevItems, ...newImages];
          setCurrentImageIndex(updatedItems.length - 1);
          return updatedItems;
        });

        addBotMessage(
          `Successfully uploaded ${files.length} image(s). You can now ask me to style them!`
        );
      } catch (error) {
        console.error("Error uploading files:", error);
        addBotMessage("Failed to upload images. Please try again.");
      }
    },
    [addBotMessage]
  );

  const handleFileChange = useCallback(
    async (event) => {
      const { files } = event.target;
      if (files?.length) {
        await handleFileUpload(Array.from(files));
      }
    },
    [handleFileUpload]
  );

  // Handle first visit
  useEffect(() => {
    if (isFirstVisit) {
      handleSendMessage(INITIAL_MESSAGE)
        .then(() => setIsFirstVisit(false))
        .catch(console.error);
    }
  }, [isFirstVisit, handleSendMessage]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      imageItems.forEach((item) => {
        if (item.imageURL) {
          URL.revokeObjectURL(item.imageURL);
        }
        item.generated?.forEach((gen) => {
          if (gen.src) {
            URL.revokeObjectURL(gen.src);
          }
        });
      });
    };
  }, [imageItems]);

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
