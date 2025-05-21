import { useState, useCallback, useMemo } from 'react';
import { Step, FlowState } from './types';
import { steps } from './steps';

/**
 * Hook para manejar el flujo conversacional.
 * Gestiona la navegación entre pasos y el estado de las respuestas.
 */
export const useFlow = () => {
  const [state, setState] = useState<FlowState>({
    currentStepId: 'start',
    answers: {},
  });

  /**
   * Obtiene el índice de un paso por su id de manera memoizada
   */
  const getStepIndex = useMemo(() => {
    // Creamos un Map para búsqueda O(1)
    const stepsMap = new Map(steps.map((s, index) => [s.id, index]));
    return (stepId: string): number => stepsMap.get(stepId) ?? -1;
  }, []);

  /**
   * Obtiene el id del siguiente paso basado en la respuesta actual
   */
  const getNextStepId = useCallback(
    (answer: string): string | undefined => {
      const currentStep = steps.find((s: Step) => s.id === state.currentStepId);
      if (!currentStep) {
        console.warn(`Paso no encontrado para el id: ${state.currentStepId}`);
        return undefined;
      }

      // Si hay opciones con nextId, priorizamos navegación declarativa
      if (currentStep.options?.length) {
        const normalizedAnswer = answer.toLowerCase().trim();
        const opt = currentStep.options.find(
          (o) =>
            o.value.toLowerCase() === normalizedAnswer || o.label.toLowerCase() === normalizedAnswer
        );
        // Solo avanzar si la opción existe y tiene nextId
        if (opt && opt.nextId) {
          return opt.nextId;
        } else {
          // Si la opción no existe o no tiene nextId, no avanzar
          return undefined;
        }
      }

      // Si next es una función, la ejecutamos
      if (typeof currentStep.next === 'function') {
        const nextId = currentStep.next(answer);
        if (nextId && !steps.some((s) => s.id === nextId)) {
          console.warn(`El paso ${nextId} especificado en next() no existe`);
        }
        return nextId;
      }

      // Si next es un string, navegación secuencial
      if (typeof currentStep.next === 'string') {
        return currentStep.next;
      }

      // Fallback: siguiente paso en el array
      const idx = getStepIndex(currentStep.id);
      if (idx >= 0 && idx < steps.length - 1) {
        return steps[idx + 1].id;
      }

      return undefined;
    },
    [state.currentStepId, getStepIndex]
  );

  /**
   * Avanza al siguiente paso y guarda la respuesta actual
   */
  const goToNext = useCallback(
    (answer: string) => {
      const nextId = getNextStepId(answer);
      if (!nextId) {
        console.warn('No se encontró un siguiente paso válido');
        return;
      }

      setState((prev: FlowState) => ({
        currentStepId: nextId,
        answers: { ...prev.answers, [prev.currentStepId]: answer },
      }));
    },
    [getNextStepId]
  );

  // Memoizamos el paso actual para evitar recálculos innecesarios
  const currentStep = useMemo(
    () => steps.find((s: Step) => s.id === state.currentStepId),
    [state.currentStepId]
  );

  // Retornamos objeto memoizado para consistencia de referencia
  return useMemo(
    () => ({
      state,
      currentStep,
      goToNext,
    }),
    [state, currentStep, goToNext]
  );
};
