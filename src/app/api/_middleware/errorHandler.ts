// src/app/api/_middleware/errorHandler.ts
import { NextRequest, NextResponse } from 'next/server';
import { formatError } from './formatError';

// Lógica pura para formatear errores, testeable sin Next.js
// export function formatError(err: unknown): { error: string; code: number } {
//   const e = err as { message?: string; code?: number };
//   return {
//     error: e?.message || 'Error interno del servidor',
//     code: e?.code || 500,
//   };
// }

export function withErrorHandler<
  T extends (req: NextRequest, context: unknown) => Promise<Response>,
>(handler: T): (req: NextRequest, context: unknown) => Promise<Response> {
  return async (req: NextRequest, context: unknown) => {
    try {
      return await handler(req, context);
    } catch (err) {
      const { error, code } = formatError(err);
      return NextResponse.json({ error, code }, { status: code });
    }
  };
}
