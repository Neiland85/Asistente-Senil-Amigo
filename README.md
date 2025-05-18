Asistente Senil Amigo
Proyecto desarrollado con Next.js y Tailwind CSS, pensado para ayudar a personas con demencia senil a través de una interfaz web amigable, rápida y segura.

🛠️ Stack Tecnológico
Next.js (v15.3.2)

React (v19.x)

Tailwind CSS (v3.x)

TypeScript

ESLint y Prettier

Vercel para despliegue continuo

📦 Estructura de carpetas

asistente-senil-amigo/
├── src/
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       └── globals.css
├── tailwind.config.js
├── postcss.config.mjs
├── package.json
├── tsconfig.json
└── ...
🚀 Instalación y desarrollo local
Instala las dependencias:

npm install
# o
pnpm install
Arranca el entorno de desarrollo:

npm run dev
Abre tu navegador en: http://localhost:3000

🏗️ Despliegue en Vercel
Este proyecto está preparado para desplegarse automáticamente en Vercel. El entorno de despliegue apunta a la rama dev por defecto, siguiendo buenas prácticas para integración continua.

Nota: Si realizas un push a la rama dev, Vercel hará el deploy automáticamente.

🌐 Edición de páginas
Las páginas principales se encuentran en src/app/. Puedes comenzar editando src/app/page.tsx.
Los estilos globales están en src/app/globals.css.

📖 Recursos útiles
Documentación oficial Next.js

Documentación Tailwind CSS

Guía despliegue Vercel

--------------------------  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - 

English Summary
Asistente Senil Amigo is a modern web application built with Next.js and Tailwind CSS. Its main objective is to provide free, user-friendly digital assistance to people suffering from senile dementia and their families. The platform is designed to be simple, accessible, and highly responsive, ensuring a smooth experience even for users with limited technical skills.

Key Features
Accessible Interface: Clean, readable UI designed for elderly users.

Fast and Secure: Developed with best practices for performance and data safety.

Easy Customization: Quickly adapt content or design through modular Next.js and Tailwind CSS components.

Getting Started
To start working on this project locally, install dependencies with:

npm install
# or
pnpm install
Then launch the development server:

npm run dev
You can access the application at http://localhost:3000.

Deployment
This project is ready for seamless deployment on Vercel.
The default production branch is dev, following modern CI/CD practices.

Whenever a push is made to the dev branch, Vercel automatically builds and deploys the latest version.
Make sure your code passes all local checks and tests before pushing.

Contribution
We welcome contributions!
If you want to collaborate, fork the repo, create a new feature branch, and submit a pull request with a detailed description of your changes.
Please follow our code style and commit conventions for consistency.

For more details, see:

Next.js Documentation

Tailwind CSS Documentation

Vercel Deployment Guide

