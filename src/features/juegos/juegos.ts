// Tipos y lógica base para minijuegos cognitivos

export type JuegoID =
  | 'memoria-semantica'
  | 'secuencias-numericas'
  | 'emparejamiento-visual'
  | 'recuerda-historia'
  | 'orden-inverso'
  | 'categorias-mentales';

export interface PreguntaBase {
  id: string;
  tipo: JuegoID;
  pregunta: string;
  opciones?: string[];
  refuerzoCorrecto: string;
  refuerzoIncorrecto: string;
}

export interface PreguntaOpcionMultiple extends PreguntaBase {
  opciones: string[];
  respuestaCorrecta: number | number[]; // índice(s) de la(s) opción(es) correcta(s)
}

export interface PreguntaAbierta extends PreguntaBase {
  tipo: 'categorias-mentales';
  tiempoSegundos: number;
}

export type PreguntaJuego = PreguntaOpcionMultiple | PreguntaAbierta;

// Ejemplo de preguntas para cada juego
export const preguntasJuegos: Record<JuegoID, PreguntaJuego[]> = {
  'memoria-semantica': [
    {
      id: 'ms-1',
      tipo: 'memoria-semantica',
      pregunta: '¿Cuál de estas palabras se parece más a “invierno”?',
      opciones: ['Sol', 'Abrigo', 'Playa', 'Caramelo', 'Bicicleta'],
      respuestaCorrecta: 1,
      refuerzoCorrecto: '¡Muy bien! “Abrigo” tiene una fuerte relación con el invierno.',
      refuerzoIncorrecto: 'La respuesta correcta era “Abrigo”. ¡Intenta la siguiente!',
    },
  ],
  'secuencias-numericas': [
    {
      id: 'sn-1',
      tipo: 'secuencias-numericas',
      pregunta: '¿Qué número sigue?: 2 - 4 - 6 - ?',
      opciones: ['8', '10', '12', '7'],
      respuestaCorrecta: 0,
      refuerzoCorrecto: '¡Exacto! Estás sumando de 2 en 2 como un verdadero genio matemático 🧠✨',
      refuerzoIncorrecto: 'La respuesta correcta era 8. ¡Vamos con la siguiente!',
    },
  ],
  'emparejamiento-visual': [
    {
      id: 'ev-1',
      tipo: 'emparejamiento-visual',
      pregunta: '¿Cuáles de estas viste antes? (🦋 🌼 🐶 🍎)',
      opciones: ['🐱', '🐶', '🌸', '🍎'],
      respuestaCorrecta: [1, 3],
      refuerzoCorrecto: '¡Muy bien! ¡Buena memoria visual!',
      refuerzoIncorrecto: 'Las respuestas correctas eran 🐶 y 🍎. ¡Sigue practicando!',
    },
  ],
  'recuerda-historia': [
    {
      id: 'rh-1',
      tipo: 'recuerda-historia',
      pregunta:
        '¿Qué compró Carlos? (Carlos fue al mercado. Compró manzanas y pan. Se encontró con su vecina Ana.)',
      opciones: ['Leche', 'Pan y manzanas', 'Fruta', 'Huevos'],
      respuestaCorrecta: 1,
      refuerzoCorrecto: '¡Correcto! Estás recordando como un/a campeón/a 💪',
      refuerzoIncorrecto: 'La respuesta correcta era “Pan y manzanas”. ¡Vamos a la siguiente!',
    },
  ],
  'orden-inverso': [
    {
      id: 'oi-1',
      tipo: 'orden-inverso',
      pregunta: 'Repite estos números en orden inverso: 3 - 7 - 2',
      opciones: ['2 - 7 - 3', '7 - 3 - 2', '2 - 3 - 7', '3 - 2 - 7'],
      respuestaCorrecta: 0,
      refuerzoCorrecto: '¡Muy bien! Este ejercicio fortalece tu concentración y memoria activa.',
      refuerzoIncorrecto: 'La respuesta correcta era 2 - 7 - 3. ¡Sigue así!',
    },
  ],
  'categorias-mentales': [
    {
      id: 'cm-1',
      tipo: 'categorias-mentales',
      pregunta: 'Tienes 30 segundos para decirme todos los ANIMALES que se te ocurran. ¡Ya!',
      tiempoSegundos: 30,
      refuerzoCorrecto: '¡Muy bien! Has recordado muchos animales 🐕🐘🐒',
      refuerzoIncorrecto: '¡Buen intento! La próxima vez seguro recuerdas más.',
    },
  ],
};
