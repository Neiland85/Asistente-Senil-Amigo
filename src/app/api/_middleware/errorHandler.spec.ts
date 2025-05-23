// src/app/api/_middleware/errorHandler.test.ts
import { formatError } from './formatError';

describe('formatError', () => {
  it('devuelve mensaje y code por defecto', () => {
    expect(formatError(undefined)).toEqual({ error: 'Error interno del servidor', code: 500 });
    expect(formatError({})).toEqual({ error: 'Error interno del servidor', code: 500 });
  });
  it('devuelve el mensaje y code de la excepción', () => {
    expect(formatError({ message: 'Ups', code: 404 })).toEqual({ error: 'Ups', code: 404 });
  });
  it('devuelve solo el mensaje si no hay code', () => {
    expect(formatError({ message: 'Solo mensaje' })).toEqual({ error: 'Solo mensaje', code: 500 });
  });
});

// NOTA: No se testea withErrorHandler aquí porque depende de NextResponse/NextRequest y Web API.
