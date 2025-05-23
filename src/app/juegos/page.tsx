'use client';

import React, { useState } from 'react';
import JuegosCognitivos from '@/features/juegos/JuegosCognitivos';
import AmistadPanel from '@/components/AmistadPanel';
import { useAmistad } from '@/hooks/useAmistad';

interface JuegoDef {
  id: string;
  nombre: string;
  icono: string;
}

const juegosDisponibles: JuegoDef[] = [
  { id: 'memoria-semantica', nombre: 'Memoria Semántica', icono: '🧠' },
  { id: 'secuencias-numericas', nombre: 'Secuencias Numéricas', icono: '🔢' },
  { id: 'emparejamiento-visual', nombre: 'Emparejamiento Visual', icono: '👁️' },
  { id: 'recuerda-historia', nombre: 'Recuerda la Historia', icono: '📖' },
  { id: 'orden-inverso', nombre: 'Orden Inverso', icono: '🔁' },
  { id: 'categorias-mentales', nombre: 'Categorías Mentales', icono: '🐶' },
];

const JuegosPage: React.FC = () => {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<string | null>(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [racha, setRacha] = useState(0);

  // Callback para gamificación
  const handleGamificacion = (correcto: boolean) => {
    if (correcto) {
      setPuntuacion((p) => p + 10);
      setRacha((r) => r + 1);
    } else {
      setRacha(0);
    }
  };

  // Reset de puntuación y racha al cambiar de juego
  const handleSeleccionJuego = (id: string) => {
    setJuegoSeleccionado(id);
    setPuntuacion(0);
    setRacha(0);
  };

  // Integración de amistad
  const usuario = 'usuario-demo'; // En producción, usar auth real
  const amistad = useAmistad(usuario);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 py-8">
      {/* Panel de amistad arriba del todo */}
      <div className="max-w-2xl mx-auto mb-8">
        <AmistadPanel {...amistad} usuario={usuario} />
      </div>
      <h1 className="text-3xl font-bold text-center text-sky-900 mb-4 drop-shadow">
        Juegos Cognitivos
      </h1>
      <div className="flex flex-col items-center mb-6">
        <div className="flex gap-6 text-lg font-semibold text-sky-800">
          <span>
            🏆 Puntuación: <span className="font-bold text-sky-900">{puntuacion}</span>
          </span>
          <span>
            🔥 Racha: <span className="font-bold text-orange-600">{racha}</span>
          </span>
        </div>
      </div>
      <nav aria-label="Selector de juegos" className="flex flex-wrap justify-center gap-4 mb-8">
        {juegosDisponibles.map((j) => (
          <button
            key={j.id}
            className={`px-6 py-3 rounded shadow font-semibold transition-all duration-200 text-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-sky-600 ${
              juegoSeleccionado === j.id
                ? 'bg-sky-700 text-white scale-105'
                : 'bg-white text-sky-700 hover:bg-sky-200'
            }`}
            onClick={() => handleSeleccionJuego(j.id)}
            aria-pressed={juegoSeleccionado === j.id}
          >
            <span className="text-2xl" aria-hidden>
              {j.icono}
            </span>{' '}
            {j.nombre}
          </button>
        ))}
      </nav>
      {juegoSeleccionado ? (
        <JuegosCognitivos juego={juegoSeleccionado} onGamificacion={handleGamificacion} />
      ) : (
        <div className="text-center text-sky-800 text-xl mt-12 animate-pulse">
          Selecciona un juego para comenzar
        </div>
      )}
    </div>
  );
};

export default JuegosPage;
