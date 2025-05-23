import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '../_middleware/errorHandler';

// En memoria: lista de "amistades" y solicitudes (en producción, usar DB)
const amistades: Array<{ userA: string; userB: string; desde: string }> = [];
const solicitudes: Array<{ de: string; para: string; fecha: string }> = [];

// POST /api/social/solicitar-amistad
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { de, para } = await req.json();
  if (!de || !para || de === para) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  // Evitar duplicados
  if (solicitudes.find((s) => s.de === de && s.para === para)) {
    return NextResponse.json({ error: 'Solicitud ya enviada' }, { status: 409 });
  }
  solicitudes.push({ de, para, fecha: new Date().toISOString() });
  return NextResponse.json({ ok: true, mensaje: 'Solicitud enviada' });
});

// GET /api/social/solicitudes?usuario=nombre
export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const usuario = searchParams.get('usuario');
  if (!usuario) return NextResponse.json({ error: 'Falta usuario' }, { status: 400 });
  const recibidas = solicitudes.filter((s) => s.para === usuario);
  const enviadas = solicitudes.filter((s) => s.de === usuario);
  const amigos = amistades.filter((a) => a.userA === usuario || a.userB === usuario);
  return NextResponse.json({ recibidas, enviadas, amigos });
});

// PATCH /api/social/aceptar-amistad
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const { de, para } = await req.json();
  // Buscar solicitud
  const idx = solicitudes.findIndex((s) => s.de === de && s.para === para);
  if (idx === -1) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
  solicitudes.splice(idx, 1);
  amistades.push({ userA: de, userB: para, desde: new Date().toISOString() });
  return NextResponse.json({ ok: true, mensaje: '¡Ahora sois amigos!' });
});
