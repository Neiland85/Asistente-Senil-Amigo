import { useState } from 'react';

export function useChat(usuario: string) {
  const [mensajes, setMensajes] = useState<
    { de: string; para: string; texto: string; fecha: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchChat = async (con: string) => {
    setLoading(true);
    const res = await fetch(`/api/social/chat?usuario=${usuario}&con=${con}`);
    const data = await res.json();
    setMensajes(data.chat || []);
    setLoading(false);
  };

  const enviarMensaje = async (para: string, texto: string) => {
    await fetch('/api/social/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ de: usuario, para, texto }),
    });
    fetchChat(para);
  };

  return {
    mensajes,
    loading,
    fetchChat,
    enviarMensaje,
  };
}
