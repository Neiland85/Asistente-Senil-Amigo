// src/app/api/_middleware/formatError.ts
export function formatError(err: unknown): { error: string; code: number } {
  const e = err as { message?: string; code?: number };
  return {
    error: e?.message || 'Error interno del servidor',
    code: e?.code || 500,
  };
}
