import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversationalFlow from './ConversationalFlow';
import { Step, FlowState } from './types';

// Hook mockeable para inyección
const createMockUseFlow =
  (
    overrides: {
      currentStep?: Step | undefined;
      goToNext?: (answer: string) => void;
      state?: FlowState;
    } = {}
  ) =>
  () => ({
    state: overrides.state || { currentStepId: 'mock', answers: {} },
    currentStep: overrides.currentStep,
    goToNext: overrides.goToNext || jest.fn(),
  });

// Utilidad para crear un Step mínimo válido
const stepBase = { id: 'mock-step', text: '', type: 'info' };

describe('ConversationalFlow', () => {
  describe('Renderizado y estados', () => {
    it('muestra error si no hay currentStep', () => {
      render(<ConversationalFlow useFlowHook={createMockUseFlow({ currentStep: undefined })} />);
      expect(screen.getByRole('alert')).toHaveTextContent(/paso no encontrado/i);
    });

    it('muestra el texto del paso actual', () => {
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: { ...stepBase, text: 'Pregunta de prueba', type: 'question' },
          })}
        />
      );
      expect(screen.getByRole('heading')).toHaveTextContent('Pregunta de prueba');
    });

    it('muestra mensaje de fin cuando el paso es de tipo end', () => {
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: { ...stepBase, text: 'Fin', type: 'end' },
          })}
        />
      );
      const endMessage = screen.getByRole('status');
      expect(endMessage).toHaveTextContent(/fin de la conversación/i);
      expect(endMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Interacción con opciones', () => {
    it('muestra y permite click en opciones', async () => {
      const goToNext = jest.fn();
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: {
              ...stepBase,
              text: 'Elige',
              type: 'choice',
              options: [
                { value: 'a', label: 'Opción A' },
                { value: 'b', label: 'Opción B' },
              ],
            },
            goToNext,
          })}
        />
      );
      const optionA = screen.getByText('Opción A');
      await userEvent.click(optionA);
      expect(goToNext).toHaveBeenCalledWith('a');
    });

    it('no muestra opciones si no hay o el array está vacío', () => {
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: { ...stepBase, text: 'Sin opciones', type: 'info' },
          })}
        />
      );
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });
  });

  describe('Formulario de entrada', () => {
    it('maneja correctamente el envío del formulario', async () => {
      const goToNext = jest.fn();
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: { ...stepBase, text: 'Pregunta', type: 'question' },
            goToNext,
          })}
        />
      );
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'Mi respuesta');
      await userEvent.click(screen.getByText('Siguiente'));
      expect(goToNext).toHaveBeenCalledWith('Mi respuesta');
      expect(input).toHaveValue('');
    });

    it('valida respuestas vacías', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: { ...stepBase, text: 'Pregunta', type: 'question' },
          })}
        />
      );
      await userEvent.click(screen.getByText('Siguiente'));
      expect(alertMock).toHaveBeenCalledWith('Por favor, introduce una respuesta');
      alertMock.mockRestore();
    });

    it('aplica validación personalizada si existe', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: {
              ...stepBase,
              text: 'Email',
              type: 'question',
              validate: (answer: string) => answer.includes('@'),
            },
          })}
        />
      );
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'invalido');
      await userEvent.click(screen.getByText('Siguiente'));
      expect(alertMock).toHaveBeenCalledWith('Respuesta no válida, revisa el formato.');
      alertMock.mockRestore();
    });
  });

  describe('Accesibilidad', () => {
    it('tiene los atributos ARIA correctos', () => {
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: { ...stepBase, text: 'Pregunta accesible', type: 'question' },
          })}
        />
      );
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Respuesta');
    });

    it('mantiene el foco en el input al cambiar de paso', async () => {
      render(
        <ConversationalFlow
          useFlowHook={createMockUseFlow({
            currentStep: { ...stepBase, text: 'Pregunta', type: 'question' },
          })}
        />
      );
      await waitFor(() => {
        expect(document.activeElement).toBe(screen.getByRole('textbox'));
      });
    });
  });
});
