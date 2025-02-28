"use client";
import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

/**
 * A basic chat widget component.
 * - Displays messages in a scrollable box
 * - Allows the user to type a new message and send it
 * - Demonstrates basic styling with Tailwind CSS
 */
export function ChatWidget() {
  // Sample messages state
  const [messages, setMessages] = useState([
    { sender: "client", text: "Bonjour, j’ai un problème avec mon installation." },
    { sender: "support", text: "Bonjour, merci pour votre message. Quel est le souci ?" },
  ]);
  
  // The new message being typed
  const [newMessage, setNewMessage] = useState("");

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return; // do nothing if empty
    // Add the new message to the list
    setMessages((prev) => [...prev, { sender: "client", text: newMessage }]);
    // Clear the input
    setNewMessage("");
    // (Optional) Here you might also trigger an API call or socket event to
    // send the message to your backend or real-time server
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-[400px] border border-[#bfddf9] rounded-lg overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f8fbff]">
        {messages.map((msg, idx) => {
          const isClient = msg.sender === "client";
          return (
            <div
              key={idx}
              className={`flex ${
                isClient ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[70%] ${
                  isClient
                    ? "bg-blue-200 text-gray-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div className="bg-white p-3 border-t border-[#bfddf9]">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Écrivez un message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={handleSendMessage}
            className="flex items-center justify-center bg-[#213f5b] hover:bg-[#162c41] text-white rounded-lg px-3 py-2"
          >
            <PaperAirplaneIcon className="w-5 h-5 transform rotate-45" />
          </button>
        </div>
      </div>
    </div>
  );
}
