import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '../_middleware/errorHandler';

// En memoria: mensajes de chat entre usuarios (en producción, usar DB)
const mensajes: Array<{ de: string; para: string; texto: string; fecha: string }> = [];
const grupos: Array<{ id: string; nombre: string; miembros: string[] }> = [];

// POST /api/social/chat
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { de, para, texto } = await req.json();
  if (!de || !para || !texto) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  mensajes.push({ de, para, texto, fecha: new Date().toISOString() });
  return NextResponse.json({ ok: true, mensaje: 'Mensaje enviado' });
});

// GET /api/social/chat?usuario=nombre&con=otro
export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const usuario = searchParams.get('usuario');
  const con = searchParams.get('con');
  if (!usuario || !con) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }
  const chat = mensajes.filter(
    (m) => (m.de === usuario && m.para === con) || (m.de === con && m.para === usuario),
  );
  return NextResponse.json({ chat });
});

// POST /api/social/grupo
export const PUT = withErrorHandler(async (req: NextRequest) => {
  const { nombre, miembros } = await req.json();
  if (!nombre || !Array.isArray(miembros) || miembros.length < 2) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const id = `grupo-${Date.now()}`;
  grupos.push({ id, nombre, miembros });
  return NextResponse.json({ ok: true, grupo: { id, nombre, miembros } });
});

// GET /api/social/grupo?usuario=nombre
export const PATCH = withErrorHandler(async (req: NextRequest) => {
  const { usuario } = await req.json();
  if (!usuario) {
    return NextResponse.json({ error: 'Falta usuario' }, { status: 400 });
  }
  const misGrupos = grupos.filter((g) => g.miembros.includes(usuario));
  return NextResponse.json({ grupos: misGrupos });
});
