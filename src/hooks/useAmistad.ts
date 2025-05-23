import { useState } from 'react';

export function useAmistad(usuario: string) {
  const [amigos, setAmigos] = useState<string[]>([]);
  const [solicitudes, setSolicitudes] = useState<{ de: string; para: string; fecha: string }[]>([]);
  const [enviadas, setEnviadas] = useState<{ de: string; para: string; fecha: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEstado = async () => {
    setLoading(true);
    const res = await fetch(`/api/social/solicitudes?usuario=${usuario}`);
    const data = await res.json();
    setAmigos(
      data.amigos?.map((a: { userA: string; userB: string }) =>
        a.userA === usuario ? a.userB : a.userA,
      ) || [],
    );
    setSolicitudes(data.recibidas || []);
    setEnviadas(data.enviadas || []);
    setLoading(false);
  };

  const solicitarAmistad = async (para: string) => {
    await fetch('/api/social/solicitar-amistad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ de: usuario, para }),
    });
    fetchEstado();
  };

  const aceptarAmistad = async (de: string) => {
    await fetch('/api/social/aceptar-amistad', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ de, para: usuario }),
    });
    fetchEstado();
  };

  return {
    amigos,
    solicitudes,
    enviadas,
    loading,
    fetchEstado,
    solicitarAmistad,
    aceptarAmistad,
  };
}
