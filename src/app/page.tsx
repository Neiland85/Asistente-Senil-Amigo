'use client';

import React, { useState, useEffect } from "react";
import ConversationalFlow from '../features/flujoConversacional/ConversationalFlow';

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function HomePage() {
  // Estado para el chat clásico
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("messages");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Guarda mensajes del chat clásico en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Envío mensaje en el chat clásico
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

  // Resetea el chat clásico
  const handleResetChat = () => {
    setMessages([]);
    setInput("");
    if (typeof window !== 'undefined') {
      localStorage.removeItem("messages");
    }
  };

  // --- ConversationalFlow: para reset también ---
  // OJO: ConversationalFlow ahora debe soportar un prop `key` para forzar rerender.
  const [flowKey, setFlowKey] = useState(0);
  const handleResetFlow = () => setFlowKey(prev => prev + 1);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">Demo Workflow Conversacional</h1>
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-6xl">
        {/* ConversationalFlow */}
        <section className="flex-1 bg-white rounded shadow-md p-6 mb-8 md:mb-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Flujo Conversacional</h2>
            <button
              className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
              onClick={handleResetFlow}
              title="Reiniciar flujo"
            >Reiniciar 🧹</button>
          </div>
          <ConversationalFlow key={flowKey} />
        </section>

        {/* Chat clásico */}
        <section className="flex-1 bg-white rounded shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Chat Manual</h2>
            <button
              className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 rounded"
              onClick={handleResetChat}
              title="Reiniciar chat"
            >Reiniciar 🧹</button>
          </div>
          <div className="h-80 overflow-y-auto border rounded p-2 bg-gray-50 shadow-inner mb-4">
            {messages.length === 0 && (
              <div className="text-gray-400 text-center my-8">No hay mensajes. Empieza una conversación 👋</div>
            )}
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
        </section>
      </div>
    </main>
  );
}
