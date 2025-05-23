// src/features/flujoConversacional/steps.ts

import { Step } from './types';

export const steps: Step[] = [
  {
    id: 'start',
    type: 'info',
    text: '¡Bienvenido! ¿Empezamos la conversación?',
    options: [
      { value: 'yes', label: 'Sí', nextId: 'step1' },
      { value: 'no', label: 'No, salir', nextId: 'end' },
    ],
    // No se usa next aquí, la navegación es declarativa por nextId
  },
  {
    id: 'step1',
    type: 'question',
    text: '¿Cuál es tu nombre?',
    next: 'step2',
  },
  {
    id: 'step2',
    type: 'choice',
    text: '¿Cómo te sientes hoy?',
    options: [
      { value: 'good', label: 'Bien', nextId: 'end' },
      { value: 'bad', label: 'Mal', nextId: 'step3' },
    ],
    // No se usa next aquí, la navegación es declarativa por nextId
  },
  {
    id: 'step3',
    type: 'info',
    text: 'Ánimo, ¡mañana será mejor!',
    next: 'end',
  },
  {
    id: 'end',
    type: 'end',
    text: 'Gracias por usar el asistente.',
  },
];
