import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JuegosPage from './page';
import { jest } from '@jest/globals';

// Mock fetch para simular API de juegos
beforeAll(() => {
  global.fetch = jest.fn((url, options) => {
    if (url?.toString().includes('/api/juegos/memoria-semantica')) {
      if (!options) {
        // GET pregunta
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              pregunta: {
                id: 'ms-1',
                tipo: 'memoria-semantica',
                pregunta: '¿Cuál de estas palabras se parece más a “invierno”?',
                opciones: ['Sol', 'Abrigo', 'Playa', 'Caramelo', 'Bicicleta'],
              },
            }),
        });
      } else {
        // POST respuesta
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              correcto: true,
              refuerzo: '¡Muy bien! “Abrigo” tiene una fuerte relación con el invierno.',
            }),
        });
      }
    }
    return Promise.reject(new Error('Not implemented in test'));
  }) as unknown as typeof global.fetch;
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('Integración de Juegos Cognitivos', () => {
  it('permite seleccionar un juego, responder y ver refuerzo', async () => {
    render(<JuegosPage />);
    // Selecciona el juego de memoria semántica
    fireEvent.click(screen.getByRole('button', { name: /memoria semántica/i }));
    // Espera a que cargue la pregunta
    expect(await screen.findByText(/invierno/i)).toBeInTheDocument();
    // Responde la opción correcta (B) Abrigo
    fireEvent.click(screen.getByRole('button', { name: /b\) abrigo/i }));
    // Espera el refuerzo
    expect(await screen.findByText(/fuerte relación con el invierno/i)).toBeInTheDocument();
    // Puntuación y racha deben actualizarse
    expect(screen.getByText(/puntuación/i).textContent).toMatch(/10/);
    expect(screen.getByText(/racha/i).textContent).toMatch(/1/);
  });
});
