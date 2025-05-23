import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConversationalFlow from './ConversationalFlow';

// NOTA: Adaptado para ESM: se testea la integración real sin mocks globales.
// Si necesitas aislar el hook, parametriza el componente en el futuro.

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
