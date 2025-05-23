import { NextRequest, NextResponse } from 'next/server';
import { preguntasJuegos, JuegoID, PreguntaJuego } from '../../../../features/juegos/juegos';
import { withErrorHandler } from '../../_middleware/errorHandler';

// Utilidad para extraer el parámetro [juego] de la URL
function getJuegoIdFromUrl(req: NextRequest): JuegoID | undefined {
  const pathParts = req.nextUrl.pathname.split('/');
  // Busca el segmento después de 'juegos'
  const juegosIdx = pathParts.findIndex((p) => p === 'juegos');
  if (juegosIdx >= 0 && pathParts.length > juegosIdx + 1) {
    return pathParts[juegosIdx + 1] as JuegoID;
  }
  return undefined;
}

// GET /api/juegos/[juego] => devuelve una pregunta aleatoria del juego
export const GET = withErrorHandler(async (req: NextRequest) => {
  const juegoId = getJuegoIdFromUrl(req);
  if (!juegoId) {
    return NextResponse.json({ error: 'Juego no especificado' }, { status: 400 });
  }
  const preguntas = preguntasJuegos[juegoId];
  if (!preguntas) {
    return NextResponse.json({ error: 'Juego no encontrado' }, { status: 404 });
  }
  // Selecciona una pregunta aleatoria
  const pregunta = preguntas[Math.floor(Math.random() * preguntas.length)];
  return NextResponse.json({ pregunta });
});

// POST /api/juegos/[juego] => recibe respuesta del usuario y devuelve refuerzo
export const POST = withErrorHandler(async (req: NextRequest) => {
  const juegoId = getJuegoIdFromUrl(req);
  if (!juegoId) {
    return NextResponse.json({ error: 'Juego no especificado' }, { status: 400 });
  }
  const preguntas = preguntasJuegos[juegoId];
  if (!preguntas) {
    return NextResponse.json({ error: 'Juego no encontrado' }, { status: 404 });
  }
  const { preguntaId, respuesta } = await req.json();
  const pregunta = preguntas.find((p: PreguntaJuego) => p.id === preguntaId);
  if (!pregunta) {
    return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 });
  }
  // Lógica de validación según tipo
  let correcto = false;
  if ('respuestaCorrecta' in pregunta) {
    if (Array.isArray(pregunta.respuestaCorrecta)) {
      correcto =
        Array.isArray(respuesta) &&
        respuesta.length === pregunta.respuestaCorrecta.length &&
        respuesta.every((r: number) => (pregunta.respuestaCorrecta as number[]).includes(r));
    } else {
      correcto = respuesta === pregunta.respuestaCorrecta;
    }
  } else if (pregunta.tipo === 'categorias-mentales') {
    correcto = Array.isArray(respuesta) && respuesta.length > 0;
  }
  return NextResponse.json({
    correcto,
    refuerzo: correcto ? pregunta.refuerzoCorrecto : pregunta.refuerzoIncorrecto,
  });
});
