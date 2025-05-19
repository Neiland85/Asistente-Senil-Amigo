import { useState } from 'react';
import { steps } from './steps';
import { Step } from './types';
// import FlowState from './types' or define it here if missing
type FlowState = {
  currentStepId: string;
  answers: Record<string, string>;
};

// Busca el índice de un paso por su id
function getStepIndex(stepId: string) {
  return steps.findIndex(s => s.id === stepId);
}

export const useFlow = () => {
  const [state, setState] = useState<FlowState>({
    currentStepId: 'start',
    answers: {},
  });

  // Calcula el id del siguiente paso
  const getNextStepId = (answer: string): string | undefined => {
    const currentStep = steps.find(s => s.id === state.currentStepId);
    if (!currentStep) {
      return undefined;
    }
    // Si next es una función, la ejecutamos
    if (typeof currentStep.next === 'function') {
      return currentStep.next(answer);
    }
    // Si hay opciones y la respuesta coincide
    if (currentStep.options) {
      const opt = currentStep.options.find(o => o.value === answer || o.label === answer);
      if (opt?.nextId) {
        return opt.nextId;
      }
    }
    // Si no hay más, pasamos al siguiente step secuencial
    const idx = getStepIndex(currentStep.id);
    if (idx >= 0 && idx < steps.length - 1) {
      return steps[idx + 1].id;
    }
    return undefined; // Fin del flujo
  };

  // Avanza el flujo con la respuesta del usuario
  const goToNext = (answer: string) => {
    const nextId = getNextStepId(answer);
    if (nextId) {
      setState((prev: FlowState) => ({
        currentStepId: nextId,
        answers: { ...prev.answers, [state.currentStepId]: answer }
      }));
    }
  };

  const currentStep = steps.find(s => s.id === state.currentStepId);

  return { state, currentStep, goToNext };
};
