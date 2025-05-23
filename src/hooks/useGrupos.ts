import { useState } from 'react';

export function useGrupos(usuario: string) {
  const [grupos, setGrupos] = useState<{ id: string; nombre: string; miembros: string[] }[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGrupos = async () => {
    setLoading(true);
    const res = await fetch('/api/social/grupo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario }),
    });
    const data = await res.json();
    setGrupos(data.grupos || []);
    setLoading(false);
  };

  const crearGrupo = async (nombre: string, miembros: string[]) => {
    await fetch('/api/social/grupo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, miembros }),
    });
    fetchGrupos();
  };

  return {
    grupos,
    loading,
    fetchGrupos,
    crearGrupo,
  };
}
