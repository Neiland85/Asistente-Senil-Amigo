# Asistente Senil Amigo

Proyecto robusto y moderno basado en Next.js 15, React 19 y TypeScript (ESM), con CI/CD seguro y despliegue automático en Vercel.

## Requisitos

- Node.js >= 20
- npm >= 9
- Vercel CLI (opcional para despliegue manual)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la app.

## Linting y Formato

```bash
npm run lint
```

Prettier está configurado automáticamente.

## Testing

```bash
npm test
```

## Variables de entorno

Copia `.env.example` a `.env` y completa los valores necesarios.

## CI/CD y Despliegue

- El pipeline de GitHub Actions ejecuta build, lint, test y despliega automáticamente a Vercel solo en la rama `dev`.
- Configura los secretos de Vercel (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`) en GitHub.

## Estructura del proyecto

- `src/app/`: Entrypoint Next.js (layout, página principal, estilos globales)
- `src/features/flujoConversacional/`: Lógica y componentes del flujo conversacional
- `src/components/`, `src/hooks/`, `src/utils/`: Componentes reutilizables, hooks y utilidades

## Buenas prácticas

- Código tipado y modular
- Tests unitarios y de integración
- Linting y formateo automáticos
- Configuración ESM y soporte para React 19/Next.js 15

## Despliegue manual

```bash
vercel --prod
```

## Licencia

MIT
