import React, { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversationalFlow from './ConversationalFlow';

// Mock de useFlow que usa estado React real para simular el flujo
jest.mock('./useFlow', () => {
  const steps = [
    {
      id: 'start',
      text: '¡Bienvenido! ¿Empezamos la conversación?',
      type: 'info',
      options: [
        { value: 'yes', label: 'Sí', nextId: 'step1' },
        { value: 'no', label: 'No, salir', nextId: 'end' },
      ],
    },
    {
      id: 'step1',
      text: '¿Cuál es tu nombre?',
      type: 'question',
      next: 'step2',
    },
    {
      id: 'step2',
      text: '¿Cómo te sientes hoy?',
      type: 'choice',
      options: [
        { value: 'good', label: 'Bien', nextId: 'end' },
        { value: 'bad', label: 'Mal', nextId: 'step3' },
      ],
    },
    {
      id: 'step3',
      text: 'Ánimo, ¡mañana será mejor!',
      type: 'info',
      next: 'end',
    },
    {
      id: 'end',
      text: 'Gracias por usar el asistente.',
      type: 'end',
    },
  ];
  return {
    useFlow: () => {
      const [state, setState] = useState<{
        currentStepId: string;
        answers: Record<string, string>;
      }>({
        currentStepId: 'start',
        answers: {},
      });
      const currentStep = steps.find((s) => s.id === state.currentStepId);
      const goToNext = (answer: string) => {
        setState((prev) => {
          const step = steps.find((s) => s.id === prev.currentStepId);
          let nextId: string | undefined;
          if (step?.options) {
            const opt = step.options.find((o) => o.value === answer || o.label === answer);
            if (opt?.nextId) {
              nextId = opt.nextId;
            }
          }
          if (!nextId && typeof step?.next === 'string') {
            nextId = step.next;
          }
          return nextId
            ? { currentStepId: nextId, answers: { ...prev.answers, [prev.currentStepId]: answer } }
            : prev;
        });
      };
      return { currentStep, goToNext, state };
    },
  };
});

describe('ConversationalFlow integración', () => {
  it('flujo completo: sí → nombre → end', () => {
    render(<ConversationalFlow />);
    expect(screen.getByText(/empezamos la conversación/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Sí'));
    expect(screen.getByText('¿Cuál es tu nombre?')).toBeInTheDocument();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Juan' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(screen.getByText('¿Cómo te sientes hoy?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Bien'));
    expect(screen.getByText(/gracias por usar el asistente/i)).toBeInTheDocument();
  });
});
