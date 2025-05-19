// src/features/flujoConversacional/utils.ts

import { Step } from './types';
import { steps } from './steps';

/* --- VALIDADORES CLÁSICOS --- */

/** Valida un email simple */
export function isValidEmail(email: string): boolean {
  return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email.trim());
}

/** Valida un número de teléfono internacional simple */
export function isValidPhone(phone: string): boolean {
  return /^\+?\d{7,15}$/.test(phone.trim());
}

/** Valida que la respuesta no esté vacía ni sea solo espacios */
export function isValidAnswer(answer: string): boolean {
  return answer.trim().length > 0;
}

/* --- FORMATTERS --- */

/** Capitaliza la primera letra del nombre, el resto en minúsculas */
export function formatUserName(name: string): string {
  if (!name) {
    return '';
  }
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/** Normaliza una respuesta (elimina espacios extra, puntos finales, etc.) */
export function normalizeAnswer(answer: string): string {
  return answer.trim().replace(/\.$/, '');
}

/* --- VALIDADORES "RAROS" (Sociología Light) --- */

/** ¿La respuesta es positiva? */
export function isPositiveAnswer(answer: string): boolean {
  const positiveWords = ['sí', 'claro', 'por supuesto', 'ok', 'seguro', 'me gusta', 'bien', 'feliz', 'genial'];
  return positiveWords.some(word => answer.toLowerCase().includes(word));
}

/** ¿La respuesta es negativa? */
export function isNegativeAnswer(answer: string): boolean {
  const negativeWords = ['no', 'nunca', 'jamás', 'no quiero', 'odio', 'mal', 'triste', 'horrible', 'fatal'];
  return negativeWords.some(word => answer.toLowerCase().includes(word));
}

/** ¿La respuesta parece escrita “a mano”? */
export function looksHandwritten(answer: string): boolean {
  if (!answer) {
    return false;
  }
  if (answer.length < 10) {
    return false;
  }
  if (answer === answer.toUpperCase()) {
    return false;
  }
  if (/^\d+$/.test(answer)) {
    return false;
  }
  return true;
}

/** ¿La respuesta es un cliché? */
export function isClicheAnswer(answer: string): boolean {
  const cliches = [
    'estoy bien', 'como siempre', 'no sé', 'todo ok', 'más de lo mismo', 'lo que digas'
  ];
  return cliches.some(cliche => answer.toLowerCase().includes(cliche));
}

/* --- LÓGICA DE FLUJO (Branching avanzado) --- */

/**
 * Busca el paso por id.
 */
export function findStepById(id: string): Step | undefined {
  return steps.find(step => step.id === id);
}

/**
 * Branching sociológico: Detecta perfil por respuestas y elige el siguiente paso.
 */
export function detectUserProfile(answers: Record<string, string>): string {
  let score = 0;
  Object.values(answers).forEach(answer => {
    if (isPositiveAnswer(answer)) {
      score++;
    }
    if (isNegativeAnswer(answer)) {
      score--;
    }
    if (isClicheAnswer(answer)) { score -= 0.5; }
    if (looksHandwritten(answer)) {
      score += 0.2;
    }
  });

  if (score > 1.5) {
    return 'optimista';
  }
  if (score < -1.5) {
    return 'escéptico';
  }
  if (score < 0 && score > -1.5) {
    return 'evasivo';
  }
  return 'neutral';
}

/**
 * Elige el siguiente paso según el perfil sociológico.
 */
export function getSociologicalNextStep(currentStepId: string, answers: Record<string, string>): Step | undefined {
  const profile = detectUserProfile(answers);
  const profileRoutes: Record<string, string> = {
    'optimista': 'motivacion_extra',
    'escéptico': 'verificacion_hechos',
    'evasivo': 'pregunta_profundizar',
    'neutral': 'siguiente_estandar'
  };
  const nextId = profileRoutes[profile] || 'siguiente_estandar';
  return steps.find(step => step.id === nextId);
}

/**
 * Lógica normal de siguiente paso.
 */
export function getNextStep(currentStepId: string, answer: string): Step | undefined {
  const currentStep = findStepById(currentStepId);
  if (!currentStep) {
    return undefined;
  }

  if (currentStep.options) {
    const selected = currentStep.options.find(opt =>
      opt.value.toLowerCase() === answer.toLowerCase() ||
      opt.label.toLowerCase() === answer.toLowerCase()
    );
    if (selected && selected.nextId) {
      return findStepById(selected.nextId);
    }
  }

  if (typeof currentStep.getNextId === 'function') {
    const nextId = currentStep.getNextId(answer);
    return nextId ? findStepById(nextId) : undefined;
  }

  const idx = steps.findIndex(s => s.id === currentStepId);
  return idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : undefined;
}

/* --- MULTILENGUAJE (SIMPLE) --- */
const translations: Record<string, Record<string, string>> = {
  en: {
    'welcome': 'Welcome!',
    'enter_email': 'Please enter your email:',
    // ...
  },
  es: {
    'welcome': '¡Bienvenido!',
    'enter_email': 'Por favor, introduce tu email:',
    // ...
  }
};

export function t(key: string, lang: 'en' | 'es' = 'es'): string {
  return translations[lang]?.[key] || key;
}

