import React, { useEffect, useState } from 'react';

interface Pregunta {
  id: string;
  tipo: string;
  pregunta: string;
  opciones?: string[];
  tiempoSegundos?: number;
}

interface RefuerzoResponse {
  correcto: boolean;
  refuerzo: string;
}

interface JuegosCognitivosProps {
  juego: string;
  onGamificacion?: (correcto: boolean) => void;
}

const JuegosCognitivos: React.FC<JuegosCognitivosProps> = ({ juego, onGamificacion }) => {
  const [pregunta, setPregunta] = useState<Pregunta | null>(null);
  const [refuerzo, setRefuerzo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [respuestaUsuario, setRespuestaUsuario] = useState<number | string[] | null>(null);
  const [esCorrecto, setEsCorrecto] = useState<boolean | null>(null);

  // Cargar pregunta al montar o cambiar juego
  useEffect(() => {
    setRefuerzo(null);
    setRespuestaUsuario(null);
    setEsCorrecto(null);
    setLoading(true);
    fetch(`/api/juegos/${juego}`)
      .then((res) => res.json())
      .then((data) => {
        setPregunta(data.pregunta);
        setLoading(false);
      });
  }, [juego]);

  const handleRespuesta = async (valor: number | string[]) => {
    if (!pregunta) return;
    setLoading(true);
    setRespuestaUsuario(valor);
    const res = await fetch(`/api/juegos/${juego}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preguntaId: pregunta.id, respuesta: valor }),
    });
    const data: RefuerzoResponse = await res.json();
    setRefuerzo(data.refuerzo);
    setEsCorrecto(data.correcto);
    setLoading(false);
    if (onGamificacion) onGamificacion(data.correcto);
  };

  const handleOtraPregunta = () => {
    setPregunta(null);
    setRefuerzo(null);
    setRespuestaUsuario(null);
    setEsCorrecto(null);
    setLoading(true);
    fetch(`/api/juegos/${juego}`)
      .then((res) => res.json())
      .then((data) => {
        setPregunta(data.pregunta);
        setLoading(false);
      });
  };

  if (loading && !pregunta) return <div className="p-4">Cargando pregunta...</div>;
  if (!pregunta) return <div className="p-4">No hay pregunta disponible.</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-6 mt-6">
      <div className="text-lg font-semibold mb-4">{pregunta.pregunta}</div>
      {pregunta.opciones && (
        <div className="flex flex-col gap-2 mb-4">
          {pregunta.opciones.map((op, idx) => (
            <button
              key={op}
              className={`bg-sky-200 hover:bg-sky-400 text-sky-900 font-bold py-2 px-4 rounded transition-all duration-150 ${respuestaUsuario === idx ? 'ring-2 ring-sky-600' : ''} ${esCorrecto !== null && respuestaUsuario === idx ? (esCorrecto ? 'bg-green-300' : 'bg-red-300') : ''}`}
              disabled={!!refuerzo}
              onClick={() => handleRespuesta(idx)}
            >
              {String.fromCharCode(65 + idx)}) {op}
            </button>
          ))}
        </div>
      )}
      {pregunta.tipo === 'categorias-mentales' && !refuerzo && (
        <div className="mb-4">
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            placeholder="Escribe animales separados por coma..."
            onBlur={(e) =>
              handleRespuesta(
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            disabled={!!refuerzo}
          />
          <div className="text-xs text-gray-500 mt-1">
            Tienes {pregunta.tiempoSegundos} segundos
          </div>
        </div>
      )}
      {refuerzo && (
        <div
          className={`mt-4 p-3 rounded font-medium animate-pulse ${esCorrecto ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {refuerzo}
        </div>
      )}
      {refuerzo && (
        <button
          className="mt-4 bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleOtraPregunta}
        >
          Otra pregunta
        </button>
      )}
    </div>
  );
};

export default JuegosCognitivos;
