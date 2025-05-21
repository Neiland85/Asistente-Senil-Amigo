import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
jest.mock('./useFlow');
import { useFlow as useFlowOriginal } from './useFlow';
import ConversationalFlow from './ConversationalFlow';

const useFlow = useFlowOriginal as jest.Mock;

describe('ConversationalFlow', () => {
  const mockGoToNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado y estados', () => {
    it('muestra error si no hay currentStep', () => {
      useFlow.mockReturnValue({ currentStep: undefined, goToNext: mockGoToNext });
      render(<ConversationalFlow />);
      expect(screen.getByRole('alert')).toHaveTextContent(/paso no encontrado/i);
    });

    it('muestra el texto del paso actual', () => {
      useFlow.mockReturnValue({
        currentStep: { text: 'Pregunta de prueba', type: 'question' },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);
      expect(screen.getByRole('heading')).toHaveTextContent('Pregunta de prueba');
    });

    it('muestra mensaje de fin cuando el paso es de tipo end', () => {
      useFlow.mockReturnValue({
        currentStep: { text: 'Fin', type: 'end' },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);
      const endMessage = screen.getByRole('status');
      expect(endMessage).toHaveTextContent(/fin de la conversación/i);
      expect(endMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Interacción con opciones', () => {
    it('muestra y permite click en opciones', async () => {
      useFlow.mockReturnValue({
        currentStep: {
          text: 'Elige',
          type: 'choice',
          options: [
            { value: 'a', label: 'Opción A' },
            { value: 'b', label: 'Opción B' },
          ],
        },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);

      const optionA = screen.getByText('Opción A');
      await userEvent.click(optionA);
      expect(mockGoToNext).toHaveBeenCalledWith('a');
    });

    it('no muestra opciones si no hay o el array está vacío', () => {
      useFlow.mockReturnValue({
        currentStep: { text: 'Sin opciones', type: 'info' },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);
      const buttons = screen.queryAllByRole('button');
      expect(buttons).toHaveLength(0);
    });
  });

  describe('Formulario de entrada', () => {
    it('maneja correctamente el envío del formulario', async () => {
      useFlow.mockReturnValue({
        currentStep: {
          text: 'Pregunta',
          type: 'question',
        },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'Mi respuesta');
      await userEvent.click(screen.getByText('Siguiente'));

      expect(mockGoToNext).toHaveBeenCalledWith('Mi respuesta');
      expect(input).toHaveValue('');
    });

    it('valida respuestas vacías', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      useFlow.mockReturnValue({
        currentStep: {
          text: 'Pregunta',
          type: 'question',
        },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);

      await userEvent.click(screen.getByText('Siguiente'));
      expect(alertMock).toHaveBeenCalledWith('Por favor, introduce una respuesta');
      expect(mockGoToNext).not.toHaveBeenCalled();

      alertMock.mockRestore();
    });

    it('aplica validación personalizada si existe', async () => {
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
      useFlow.mockReturnValue({
        currentStep: {
          text: 'Email',
          type: 'question',
          validate: (answer: string) => answer.includes('@'),
        },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);

      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'invalido');
      await userEvent.click(screen.getByText('Siguiente'));

      expect(alertMock).toHaveBeenCalledWith('Respuesta no válida, revisa el formato.');
      expect(mockGoToNext).not.toHaveBeenCalled();

      alertMock.mockRestore();
    });
  });

  describe('Accesibilidad', () => {
    it('tiene los atributos ARIA correctos', () => {
      useFlow.mockReturnValue({
        currentStep: {
          text: 'Pregunta accesible',
          type: 'question',
        },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);

      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Respuesta');
    });

    it('mantiene el foco en el input al cambiar de paso', async () => {
      useFlow.mockReturnValue({
        currentStep: {
          text: 'Pregunta',
          type: 'question',
        },
        goToNext: mockGoToNext,
      });
      render(<ConversationalFlow />);

      await waitFor(() => {
        expect(document.activeElement).toBe(screen.getByRole('textbox'));
      });
    });
  });
});
