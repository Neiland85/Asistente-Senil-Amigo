// src/features/flujoConversacional/types.ts

// Tipos de paso posibles
export type StepType = 'info' | 'question' | 'choice' | 'end';

// Opción de respuesta para pasos tipo 'choice'
export interface StepOption {
  value: string;
  label: string;
  // Se recomienda usar solo nextId para navegación declarativa escalable
  nextId?: string;
}

// Definición de un paso del flujo conversacional
export interface Step {
  id: string;
  type: StepType;
  text: string;
  options?: StepOption[];
  // Para máxima escalabilidad, usar nextId en opciones o next como función, pero no ambos a la vez
  next?: string | ((answer: string) => string | undefined);
  validate?: (answer: string) => boolean | undefined;
}

// Estado del flujo para el hook
export interface FlowState {
  currentStepId: string;
  answers: Record<string, string>;
}
