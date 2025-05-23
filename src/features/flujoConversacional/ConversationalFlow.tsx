import React, { useState, useRef, useEffect, FormEvent, useCallback } from 'react';
import { useFlow as useFlowDefault } from './useFlow';

interface ConversationalFlowProps {
  useFlowHook?: typeof useFlowDefault;
}

/**
 * Componente que maneja el flujo de conversación interactiva.
 * Soporta diferentes tipos de pasos (preguntas, opciones, información) y
 * gestiona la navegación entre ellos.
 */
const ConversationalFlow: React.FC<ConversationalFlowProps> = ({
  useFlowHook = useFlowDefault,
}) => {
  const { currentStep, goToNext } = useFlowHook();
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus en el input cuando cambia el paso
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100); // Pequeño delay para asegurar que el DOM está listo
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Validación y manejo de respuestas
  const handleNext = useCallback(
    (answer: string) => {
      if (!answer.trim()) {
        alert('Por favor, introduce una respuesta');
        return;
      }

      if (currentStep?.validate && !currentStep.validate(answer)) {
        alert('Respuesta no válida, revisa el formato.');
        return;
      }

      goToNext(answer);
      setInput('');
    },
    [currentStep, goToNext]
  );

  const handleFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleNext(input);
    },
    [input, handleNext]
  );

  const handleOptionClick = useCallback(
    (value: string) => {
      handleNext(value);
    },
    [handleNext]
  );

  // Manejo de error si no hay paso actual
  if (!currentStep) {
    return (
      <div role="alert" className="text-red-600 p-4 rounded bg-red-50">
        ❌ Error: Paso no encontrado.
      </div>
    );
  }

  return (
    <section className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-medium mb-4" role="heading">
        {currentStep.text}
      </h2>

      {Array.isArray(currentStep.options) && currentStep.options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentStep.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleOptionClick(opt.value)}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded transition-colors"
              aria-label={`Seleccionar opción: ${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {currentStep.type === 'question' && (
        <form role="form" onSubmit={handleFormSubmit} className="mt-4 flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-300"
            autoFocus
            type="text"
            aria-label="Respuesta"
            placeholder="Escribe tu respuesta..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            aria-label="Enviar respuesta"
          >
            Siguiente
          </button>
        </form>
      )}

      {currentStep.type === 'end' && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 p-4 bg-green-50 text-green-700 rounded"
        >
          🎉 Fin de la conversación.
        </div>
      )}
    </section>
  );
};

export default ConversationalFlow;
