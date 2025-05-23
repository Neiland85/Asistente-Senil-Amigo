import React, { useEffect, useState } from 'react';
import { useAmistad } from '@/hooks/useAmistad';

interface AmistadPanelProps {
  usuario: string;
}

const AmistadPanel: React.FC<AmistadPanelProps> = ({ usuario }) => {
  const { amigos, solicitudes, enviadas, fetchEstado, solicitarAmistad, aceptarAmistad, loading } =
    useAmistad(usuario);
  const [nuevoAmigo, setNuevoAmigo] = useState('');

  useEffect(() => {
    fetchEstado();
    // eslint-disable-next-line
  }, [usuario]);

  return (
    <div className="bg-white rounded shadow p-4 max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-2 text-sky-800">Amigos y Solicitudes</h2>
      <div className="mb-4">
        <input
          type="text"
          className="border rounded px-2 py-1 mr-2"
          placeholder="Usuario para solicitar amistad"
          value={nuevoAmigo}
          onChange={(e) => setNuevoAmigo(e.target.value)}
        />
        <button
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-1 px-3 rounded"
          onClick={() => {
            solicitarAmistad(nuevoAmigo);
            setNuevoAmigo('');
          }}
          disabled={loading || !nuevoAmigo}
        >
          Enviar solicitud
        </button>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Amigos:</span>
        <ul className="list-disc ml-6">
          {amigos.length === 0 && <li className="text-gray-500">Sin amigos aún</li>}
          {amigos.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Solicitudes recibidas:</span>
        <ul className="list-disc ml-6">
          {solicitudes.length === 0 && <li className="text-gray-500">Ninguna</li>}
          {solicitudes.map((s) => (
            <li key={s.de}>
              {s.de}{' '}
              <button
                className="ml-2 text-green-700 underline"
                onClick={() => aceptarAmistad(s.de)}
              >
                Aceptar
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <span className="font-semibold">Solicitudes enviadas:</span>
        <ul className="list-disc ml-6">
          {enviadas.length === 0 && <li className="text-gray-500">Ninguna</li>}
          {enviadas.map((s) => (
            <li key={s.para}>{s.para}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AmistadPanel;
