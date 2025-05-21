# Checklist de Buenas Prácticas para Flujos Conversacionales y CI/CD

## 1. Estructura y Tipado

- [ ] Todos los tipos (`Step`, `StepOption`, `FlowState`, etc.) están definidos en archivos separados y bien documentados.
- [ ] El tipado de TypeScript es estricto y se usa en todo el flujo.
- [ ] Los steps del flujo están centralizados en un único archivo (`steps.ts`).

## 2. Lógica y Componentes

- [ ] La lógica de navegación y estado está en un hook personalizado (`useFlow`).
- [ ] El componente de UI solo renderiza y delega la navegación al hook.
- [ ] Se usan `useCallback` y `useMemo` para optimizar renders.

## 3. Accesibilidad (a11y)

- [ ] Todos los formularios y mensajes tienen roles ARIA apropiados.
- [ ] El foco se gestiona automáticamente al cambiar de paso.
- [ ] Inputs y botones tienen etiquetas (`aria-label`) descriptivas.
- [ ] El diseño tiene buen contraste y fuentes legibles.
- [ ] El flujo es navegable por teclado.

## 4. Validaciones

- [ ] Hay validadores reutilizables para email, teléfono y respuestas vacías.
- [ ] Cada step puede tener su propia función de validación (`validate`).

## 5. Pruebas

- [ ] Hay tests unitarios para la lógica de navegación (`useFlow.test.ts`).
- [ ] Hay tests unitarios para utilidades y validadores (`utils.test.ts`).
- [ ] Hay tests unitarios para la configuración de pasos (`steps.test.ts`).
- [ ] Hay tests de integración para el flujo completo de usuario (`ConversationalFlow.integration.test.tsx`).
- [ ] Los tests cubren casos límite y errores esperados.
- [ ] Los mocks de steps en los tests reflejan la estructura real.

## 6. CI/CD

- [ ] El pipeline valida formato (Prettier), lint (ESLint), build y tests en matriz de Node.js.
- [ ] El pipeline se ejecuta en cada push y pull request.
- [ ] Se reporta la cobertura de tests.
- [ ] El despliegue automático solo ocurre en ramas principales.

## 7. Mantenibilidad y Extensibilidad

- [ ] Cada función y tipo está documentado con comentarios claros.
- [ ] Los nombres de variables y funciones son descriptivos y consistentes.
- [ ] La lógica de validación y navegación está centralizada.
- [ ] Es fácil añadir nuevos tipos de pasos o validaciones.
- [ ] El flujo soporta internacionalización (i18n) si es necesario.

## 8. UX

- [ ] Se muestra el estado actual del flujo (ej: “Paso 2 de 5”).
- [ ] Hay opción clara y accesible para reiniciar el flujo.
- [ ] El usuario recibe feedback inmediato tras cada acción.

---

> Revisa esta checklist antes de cada entrega o cambio importante. ¡Así mantenemos calidad y robustez en el equipo!
