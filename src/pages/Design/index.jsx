import React, { useState, useEffect, useCallback } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";
import { encodeBlobToBase64 } from "./imageUtils";
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
  const [seed] = useState(() => Math.floor(Math.random() * 100) + 1);

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
        // Add user message to chat
        if (!isFirstVisit) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
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

  const generateStyle = useCallback(
    async (prompt, intention) => {
      setLoading(true);

      try {
        const currentImage = imageItems[currentImageIndex];
        if (!currentImage) {
          throw new Error("No image selected");
        }

        console.log("currentImage: ", currentImage);

        const base64Data = currentImage.base64Data.split(",")[1];

        const response = await axios.post(
          `${API_BASE_URL}/generate-image`,
          {
            prompt,
            input_image: base64Data,
            run_mode: intention,
            seed,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newGeneratedImage = response.data.image
          ? `data:image/png;base64,${response.data.image}`
          : null;

        if (!newGeneratedImage) {
          throw new Error("No image was generated");
        }

        const newImages = [
          {
            id: crypto.randomUUID(),
            base64Data: newGeneratedImage,
          },
        ];

        setImageItems((prevItems) => {
          const updatedItems = [...prevItems, ...newImages];
          setCurrentImageIndex(updatedItems.length - 1);
          return updatedItems;
        });

        addBotMessage("Here! We generated for you!");
      } catch (error) {
        console.error("Error during style generation:", error);
        addBotMessage(`Error: ${error.message || "Failed to generate style"}`);
      } finally {
        setLoading(false);
      }
    },
    [imageItems, currentImageIndex, seed, addBotMessage]
  );

  const handleFileUpload = useCallback(
    async (files) => {
      try {
        const newImages = await Promise.all(
          files.map(async (file) => {
            const reader = new FileReader();
            const base64Promise = new Promise((resolve) => {
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(file);
            });
            const base64Data = await base64Promise;

            return {
              id: crypto.randomUUID(),
              base64Data: base64Data,
            };
          })
        );

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
        generateStyle={generateStyle}
      />
      <RightSidebar
        loading={loading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messages={messages}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
