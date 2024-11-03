import React, { useState, useRef, useEffect, useCallback } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";
import { Paintbrush, Upload, Eraser } from "lucide-react";
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

    return JSON.parse(data.message.content);
  } catch (error) {
    console.error("Error communicating with chat API:", error);
    throw new Error("Failed to generate chat response");
  }
};

const resizeImage = (base64Data, targetWidth = 832, targetHeight = 640) => {
  // Create temporary canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  // Create temporary image
  const img = new Image();
  img.src = `data:image/png;base64,${base64Data}`;

  return new Promise((resolve) => {
    img.onload = () => {
      // Draw image with new dimensions
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      // Get resized base64
      const resizedBase64 = canvas.toDataURL("image/png").split(",")[1];
      resolve(resizedBase64);
    };
  });
};

const tools = [
  {
    id: "upload",
    icon: Upload,
    name: "Upload",
    tooltip: "Upload an image",
  },
  {
    id: "brush",
    icon: Paintbrush,
    name: "Brush",
    tooltip: "Draw with brush",
  },
  {
    id: "reset",
    icon: Eraser,
    name: "Reset",
    tooltip: "Reset changes",
  },
];

export default function Design() {
  const stageRef = useRef(null);
  const linesLayerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [imageItems, setImageItems] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [seed] = useState(() => Math.floor(Math.random() * 100) + 1);

  const [selectedTool, setSelectedTool] = useState(tools[0].id);
  const [lines, setLines] = useState([]);

  const handleToolClick = (toolId) => {
    setSelectedTool(toolId);
  };

  const handleResetLines = () => {
    setLines([]);
  };

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

        // Only generate chat response if there's an image uploaded
        if (imageItems.length > 0) {
          const chatResponse = await generateChatResponse(message);

          if (chatResponse?.message) {
            const intention = chatResponse.intention;
            if (["segment", "inpaint"].includes(intention)) {
              // Because we are using llama3.2:1b model, it sometimes returns "segment" as intention
              let finalIntention;
              if (intention === "inpaint") {
                if (!stageRef.current) {
                  addBotMessage(
                    "Please use the brush tool to highlight the area you want to inpaint."
                  );
                  return;
                }
              }
              if (stageRef.current) {
                finalIntention = "inpaint";
              } else {
                finalIntention = intention;
              }
              await generateStyle(chatResponse.message, finalIntention);
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

        const base64Data = await resizeImage(
          currentImage.base64Data.split(",")[1]
        );

        let payload;
        if (intention === "inpaint") {
          payload = {
            prompt,
            input_image: base64Data,
            mask_image: extractMask(),
            run_mode: "inpaint",
            seed,
          };
        } else {
          payload = {
            prompt,
            input_image: base64Data,
            run_mode: "segment",
            seed,
          };
        }

        const response = await axios.post(
          `${API_BASE_URL}/generate-image`,
          payload,
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
        setLines([]);
      }
    },
    [imageItems, currentImageIndex, addBotMessage]
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

  const extractMask = () => {
    if (!stageRef.current) return null;

    const layer = linesLayerRef.current;
    const width = layer.width();
    const height = layer.height();

    // Create temporary canvas for mask
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Fill with black background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw white lines
    ctx.strokeStyle = "white";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const lineLayer = linesLayerRef.current;
    const lineLayerCanvas = lineLayer.toCanvas();
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(lineLayerCanvas, 0, 0);

    // Ensure mask is binary
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      } else {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mask.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
    // Convert to base64
    return canvas.toDataURL("image/png");
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
        generateStyle={generateStyle}
        selectedTool={selectedTool}
        stageRef={stageRef}
        linesLayerRef={linesLayerRef}
        lines={lines}
        setLines={setLines}
      />
      <RightSidebar
        loading={loading}
        messages={messages}
        handleSendMessage={handleSendMessage}
        tools={tools}
        selectedTool={selectedTool}
        handleToolClick={handleToolClick}
        handleFileChange={handleFileChange}
        handleResetLines={handleResetLines}
      />
    </div>
  );
}
