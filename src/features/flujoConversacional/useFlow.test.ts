import { renderHook, act } from '@testing-library/react';
import { useFlow } from './useFlow';

jest.mock('./steps', () => ({
  steps: [
    {
      id: 'start',
      type: 'info',
      text: '¡Bienvenido! ¿Empezamos la conversación?',
      options: [
        { value: 'yes', label: 'Sí', nextId: 'step1' },
        { value: 'no', label: 'No, salir', nextId: 'end' },
      ],
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
      // No next para que solo avance si la opción existe
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
  ],
}));

describe('useFlow', () => {
  it('debería inicializar con el paso start', () => {
    const { result } = renderHook(() => useFlow());
    expect(result.current.state.currentStepId).toBe('start');
    expect(result.current.state.answers).toEqual({});
    expect(result.current.currentStep?.id).toBe('start');
  });

  it('debería navegar correctamente usando next de función en las opciones', () => {
    const { result } = renderHook(() => useFlow());
    act(() => {
      result.current.goToNext('yes'); // start -> step1
    });
    expect(result.current.state.currentStepId).toBe('step1');
    expect(result.current.state.answers.start).toBe('yes');
  });

  it('debería navegar usando la función next o next string', () => {
    const { result } = renderHook(() => useFlow());
    act(() => {
      result.current.goToNext('yes'); // start -> step1
    });
    act(() => {
      result.current.goToNext('Juan'); // step1 -> step2
    });
    expect(result.current.state.currentStepId).toBe('step2');
    expect(result.current.state.answers.step1).toBe('Juan');
  });

  it('debería mantener consistencia en las respuestas', () => {
    const { result } = renderHook(() => useFlow());
    act(() => {
      result.current.goToNext('yes'); // start -> step1
    });
    act(() => {
      result.current.goToNext('Juan'); // step1 -> step2
    });
    act(() => {
      result.current.goToNext('good'); // step2 -> end
    });
    // La respuesta 'Juan' se guarda en step1, 'good' en step2
    expect(result.current.state.answers).toEqual({
      start: 'yes',
      step1: 'Juan',
      step2: 'good',
    });
  });

  it('no debería avanzar ni guardar respuesta si la opción no existe y no hay next válido', () => {
    const { result } = renderHook(() => useFlow());
    act(() => {
      result.current.goToNext('yes'); // start -> step1
    });
    act(() => {
      result.current.goToNext('Juan'); // step1 -> step2
    });
    act(() => {
      result.current.goToNext('invalid_option'); // step2: opción inválida, no avanza
    });
    // El flujo se queda en step2 y solo se guardan las respuestas válidas
    expect(result.current.state.currentStepId).toBe('step2');
    expect(result.current.state.answers).toEqual({
      start: 'yes',
      step1: 'Juan',
    });
  });

  it('debería normalizar las respuestas al comparar opciones', () => {
    const { result } = renderHook(() => useFlow());
    act(() => {
      result.current.goToNext('YES'); // start -> step1 (debe ser case-insensitive)
    });
    expect(result.current.state.currentStepId).toBe('step1');
  });
});
