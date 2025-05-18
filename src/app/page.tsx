// src/app/page.tsx
'use client';
import React, { useState, useEffect } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function HomePage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("messages");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Guarda en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) {
      return;
    }
    setMessages((msgs) => [
      ...msgs,
      { sender: "user", text: input },
      { sender: "bot", text: "Hola, soy tu asistente. ¿En qué puedo ayudarte hoy?" },
    ]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Demo Workflow Conversacional</h1>
        <div className="h-80 overflow-y-auto border rounded p-2 bg-white shadow">
          {messages.map((msg, idx) => (
            <div key={idx} className={`my-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-3 py-1 rounded ${msg.sender === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
                <strong>{msg.sender === "user" ? "Tú" : "Asistente"}:</strong> {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSend}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
