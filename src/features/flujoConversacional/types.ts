// Tipos de paso posibles
export type StepType = 'info' | 'question' | 'choice' | 'end';

// Opción de respuesta para pasos tipo 'choice' o similares
export interface StepOption {
  value: string;  // Valor para lógica interna
  label: string;  // Lo que ve el usuario
  nextId?: string; // Opcional: permite saltar a un id concreto (más flexible)
}

// Cada paso puede tener esta forma
export interface Step {
  id: string;
  type: StepType;
  text: string;
  options?: StepOption[]; // Opciones si aplica

  // La magia: next puede ser string, función, o undefined si es final
  next?: string | ((answer: string) => string);
  // Puedes añadir más campos como validate, hint, getNextId, etc.
  validate?: (answer: string) => boolean;
}

export interface FlowState {
  currentStepId: string;
  answers: Record<string, string>; // { [stepId]: answer }
}

export interface Step {
  id: string;
  type: StepType;
  text: string;
  options?: StepOption[]; // Opciones si aplica
  next?: string | ((answer: string) => string);
  validate?: (answer: string) => boolean;
  // 👇 Añade esto:
  getNextId?: (answer: string) => string;
  
}