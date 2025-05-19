// src/features/flujoConversacional/steps.ts

import { Step } from './types';

export const steps: Step[] = [
  {
    id: 'start',
    type: 'info',
    text: '¡Bienvenido! ¿Empezamos la conversación?',
    options: [
      { value: 'yes', label: 'Sí' },
      { value: 'no', label: 'No, salir' }
    ],
    // Aquí next puede ser función o string según tu tipo Step
    next: (answer: string) => (answer === 'yes' ? 'step1' : 'end')
  },
  {
    id: 'step1',
    type: 'question',
    text: '¿Cuál es tu nombre?',
    // Si luego quieres validar el nombre, aquí podrías meter un validador
    next: () => 'step2'
  },
  {
    id: 'step2',
    type: 'choice',
    text: '¿Cómo te sientes hoy?',
    options: [
      { value: 'good', label: 'Bien' },
      { value: 'bad', label: 'Mal' }
    ],
    next: (answer: string) => (answer === 'good' ? 'end' : 'step3')
  },
  {
    id: 'step3',
    type: 'info',
    text: 'Ánimo, ¡mañana será mejor!',
    next: () => 'end'
  },
  {
    id: 'end',
    type: 'end',
    text: 'Gracias por usar el asistente.'
  }
];
