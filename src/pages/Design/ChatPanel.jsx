import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import Lottie from "lottie-react";

const ChatPanel = ({ loading, messages, handleSendMessage }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const fetchLottieAnimation = async () => {
      try {
        const response = await fetch(
          "https://lottie.host/224451fc-b394-427f-993b-f345d76f1600/Uf9l4QRVjF.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        console.log("data: ", data);
        setAnimationData(data);
      } catch (error) {
        console.error("Error loading Lottie animation:", error);
      }
    };

    fetchLottieAnimation();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("messages: ", messages);
  }, [messages]);

  const clickSendMessage = async () => {
    await handleSendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        clickSendMessage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [message]);

  return (
    <div className="flex flex-col h-[95%]">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              } w-full animate-fadeInUp
          `}
            >
              <div
                className={`
              max-w-[90%]
              transition-all duration-300 ease-in-out
            `}
              >
                <div
                  className={`
                p-2 rounded-2xl shadow-sm
                ${
                  msg.sender === "bot"
                    ? "bg-blue-50 rounded-tl-sm text-left"
                    : "bg-gray-50 rounded-tr-sm text-right"
                }
                animate-fade-in transform hover:shadow-md
                transition-all duration-200
              `}
                >
                  {msg.contentType === "PlainText" ? (
                    <p
                      className={
                        "text-sm leading-relaxed text-gray-800 text-left"
                      }
                    >
                      {msg.content}
                    </p>
                  ) : msg.contentType === "ImageResponseCard" ? (
                    <div className="space-y-3">
                      <h3
                        className={`
                    text-sm font-semibold text-gray-900
                    ${msg.sender === "bot" ? "text-left" : "text-right"}
                  `}
                      >
                        {msg.imageResponseCard.title}
                      </h3>

                      <div className="flex flex-col gap-2">
                        {msg.imageResponseCard.buttons.map(
                          (button, btnIndex) => (
                            <button
                              key={btnIndex}
                              onClick={() => handleSendMessage(button.value)}
                              className="
                          w-full text-left px-4 py-2.5
                          bg-white/80 hover:bg-white
                          text-sm font-medium text-gray-700
                          rounded-lg border border-gray-100
                          transition-all duration-200
                          hover:shadow-sm hover:translate-y-[-1px]
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          active:scale-[0.99]
                        "
                            >
                              {button.text}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          {loading && animationData && (
            <div className="flex justify-center">
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: 100, height: 100 }}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t">
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded-md mb-2 resize-none"
          rows={3}
        />
        <button
          onClick={clickSendMessage}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Send Message
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
