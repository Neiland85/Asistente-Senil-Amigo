// src/features/flujoConversacional/ConversationalFlow.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useFlow } from './useFlow';
import { Step } from './types';
import { formatUserName } from './utils';

export default function ConversationalFlow() {
  const { state, currentStep, goToNext } = useFlow();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Limpiar input y errores cuando cambia el paso
    setInput('');
    setError('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStep?.id]);

  if (!currentStep) return <div>❌ Error: Paso no encontrado.</div>;

  // Validación si el paso tiene validador
  const handleNext = (answer: string) => {
    if (currentStep.validate && !currentStep.validate(answer)) {
      setError('Respuesta no válida, revisa el formato.');
      return;
    }
    goToNext(answer);
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <h2>{currentStep.text}</h2>

      {/* Opciones tipo choice */}
      {currentStep.options && (
        <div style={{ marginBottom: 16 }}>
          {currentStep.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleNext(opt.value)}
              style={{
                margin: 8,
                padding: '8px 18px',
                borderRadius: 8,
                border: '1px solid #eee',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Pregunta tipo input */}
      {currentStep.type === 'question' && (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleNext(input.trim());
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            style={{ padding: 8, borderRadius: 6, width: '80%' }}
            placeholder="Escribe tu respuesta..."
          />
          <button type="submit" style={{ marginLeft: 8 }}>Siguiente</button>
        </form>
      )}

      {error && (
        <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>
      )}

      {/* Paso final */}
      {currentStep.type === 'end' && (
        <div style={{ marginTop: 16 }}>🎉 Fin de la conversación.</div>
      )}
    </div>
  );
}
