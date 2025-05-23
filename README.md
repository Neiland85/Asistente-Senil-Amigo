# 🧑‍⚕️ Asistente Senil Amigo

![Animated Banner](https://readme-typing-svg.demolab.com?font=Fira+Code&pause=700&color=38BDF8&center=true&vCenter=true&width=480&lines=Automatizar+para+cuidar;Conversational+Flow+para+personas+reales;Next.js+%2B+Tailwind+%2F+Hecho+con+propósito)

> Aplicación web moderna, para acompañar y guiar a personas con demencia senil y sus familias.  
> Construida con **Next.js** + **Tailwind CSS** + **CI/CD en Vercel** para máxima rapidez, accesibilidad y seguridad.

## Pipeline

![CI/CD](https://github.com/Neiland85/Asistente-Senil-Amigo/actions/workflows/ci.yml/badge.svg)  
[![Vercel](https://vercelbadge.vercel.app/api/Neiland85/Asistente-Senil-Amigo?style=flat)](https://asistente-senil-amigo.vercel.app/)

---

## 🚀 Descripción y Propósito

He desarrollado este Bot inspirándome en estudios de modelos causales bayesianos (DoWhy, Pyro) y otras metodologías avanzadas de IA social. El objetivo es encontrar un equilibrio entre sentido del humor, utilidad y un toque de excentricidad en la interacción.

## 🛠️ Stack Tecnológico

- **Next.js** (v15.3.2)
- **React** (v19.x)
- **Tailwind CSS** (v3.x)
- **TypeScript** (ESM)
- **ESLint** + **Prettier**
- **Vercel** para CI/CD automático

## 📦 Estructura del Proyecto

```
asistente-senil-amigo/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   └── flujoConversacional/
│   ├── hooks/
│   ├── styles/
│   └── utils/
├── tailwind.config.js
├── postcss.config.mjs
├── package.json
├── tsconfig.json
└── ...
```

## 🚦 Roadmap y Funcionalidades

- Conversational Flow personalizable
- i18n & Accesibilidad
- Pruebas unitarias y de integración
- Integración con APIs de salud
- PWA & Automatización avanzada
- Beta pública y demo
- Feedback y mejoras continuas
- Comunidad y documentación

## ⚡ Instalación y Desarrollo

```bash
npm install
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## 🧹 Linting y Formato

```bash
npm run lint
```

Prettier está configurado automáticamente.

## 🧪 Testing

```bash
npm test
```

## 🔑 Variables de entorno

Copia `.env.example` a `.env` y completa los valores necesarios.

## 🚀 CI/CD y Despliegue

- El pipeline de GitHub Actions ejecuta build, lint, test y despliega automáticamente a Vercel solo en la rama `dev`.
- Configura los secretos de Vercel (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN`) en GitHub.
- Despliegue manual:

```bash
vercel --prod
```

## 🤝 Contribución

Fork, crea una rama feature, haz tu PR y únete. ¡Todas las mejoras de accesibilidad y UX son bienvenidas!

## 📚 Documentación

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vercel](https://vercel.com/)
- [CI/CD](https://github.com/Neiland85/Asistente-Senil-Amigo/actions/workflows/ci.yml)
- [Accessibility](https://www.w3.org/WAI/standards-guidelines/)
- [UX](https://www.usability.gov/)
- [API Restful](https://restfulapi.net/)
- [Community](https://github.com/Neiland85/Asistente-Senil-Amigo/blob/main/CONTRIBUTING.md)

## 🌍 English Summary

"Asistente Senil Amigo" is an open-source web app to help people with senile dementia and their families — focused on real utility and accessibility. Built with Next.js, Tailwind CSS, and Vercel CI/CD.

## 📝 Licencia

MIT

---

> “La búsqueda de la verdad es más valiosa que su posesión.” — Kurt Gödel
