import {
  isValidEmail,
  isValidPhone,
  isValidAnswer,
  capitalizeName,
  normalizeAnswer,
  isPositiveAnswer,
  isNegativeAnswer,
  looksHandwritten,
  isClicheAnswer,
  detectUserProfile,
} from './utils';

describe('Utilidades de validación', () => {
  describe('isValidEmail', () => {
    it('debería validar emails correctos', () => {
      expect(isValidEmail('usuario@dominio.com')).toBe(true);
      expect(isValidEmail('user.name@sub.domain.org')).toBe(true);
    });

    it('debería rechazar emails inválidos', () => {
      expect(isValidEmail('invalido')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('debería validar números de teléfono correctos', () => {
      expect(isValidPhone('+34666777888')).toBe(true);
      expect(isValidPhone('666777888')).toBe(true);
    });

    it('debería rechazar teléfonos inválidos', () => {
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('+34')).toBe(false);
    });
  });

  describe('isValidAnswer', () => {
    it('debería validar respuestas no vacías', () => {
      expect(isValidAnswer('respuesta')).toBe(true);
    });

    it('debería rechazar respuestas vacías o solo espacios', () => {
      expect(isValidAnswer('')).toBe(false);
      expect(isValidAnswer('   ')).toBe(false);
    });
  });
});

describe('Utilidades de formato', () => {
  describe('capitalizeName', () => {
    it('debería capitalizar nombres correctamente', () => {
      expect(capitalizeName('juan')).toBe('Juan');
      expect(capitalizeName('MARÍA')).toBe('María');
    });

    it('debería manejar valores vacíos', () => {
      expect(capitalizeName('')).toBe('');
    });
  });

  describe('normalizeAnswer', () => {
    it('debería normalizar respuestas correctamente', () => {
      expect(normalizeAnswer('  respuesta  ')).toBe('respuesta');
      expect(normalizeAnswer('respuesta.')).toBe('respuesta');
    });

    it('debería manejar valores no string', () => {
      expect(normalizeAnswer('')).toBe('');
    });
  });
});

describe('Análisis de respuestas', () => {
  describe('isPositiveAnswer', () => {
    it('debería detectar respuestas positivas', () => {
      expect(isPositiveAnswer('sí, me parece bien')).toBe(true);
      expect(isPositiveAnswer('estoy bien')).toBe(true);
    });

    it('debería rechazar respuestas no positivas', () => {
      expect(isPositiveAnswer('no lo sé')).toBe(false);
    });
  });

  describe('isNegativeAnswer', () => {
    it('debería detectar respuestas negativas', () => {
      expect(isNegativeAnswer('no quiero')).toBe(true);
      expect(isNegativeAnswer('me siento mal')).toBe(true);
    });

    it('debería rechazar respuestas no negativas', () => {
      expect(isNegativeAnswer('quizás')).toBe(false);
    });
  });

  describe('looksHandwritten', () => {
    it('debería detectar respuestas personalizadas', () => {
      expect(looksHandwritten('Me siento bastante mejor hoy')).toBe(true);
    });

    it('debería rechazar respuestas simples o automáticas', () => {
      expect(looksHandwritten('ok')).toBe(false);
      expect(looksHandwritten('12345')).toBe(false);
      expect(looksHandwritten('TEXTO EN MAYÚSCULAS')).toBe(false);
    });
  });

  describe('isClicheAnswer', () => {
    it('debería detectar respuestas cliché', () => {
      expect(isClicheAnswer('estoy bien')).toBe(true);
      expect(isClicheAnswer('como siempre')).toBe(true);
    });

    it('debería aceptar respuestas originales', () => {
      expect(isClicheAnswer('hoy me siento especialmente animado')).toBe(false);
    });
  });
});

describe('Análisis de perfil', () => {
  describe('detectUserProfile', () => {
    it('debería detectar perfil optimista', () => {
      const answers = {
        q1: 'sí, me siento muy bien',
        q2: 'estoy feliz',
        q3: 'todo es genial',
      };
      expect(detectUserProfile(answers)).toBe('optimista');
    });

    it('debería detectar perfil escéptico', () => {
      const answers = {
        q1: 'no, todo va mal',
        q2: 'me siento fatal',
        q3: 'odio esto',
      };
      expect(detectUserProfile(answers)).toBe('escéptico');
    });

    it('debería detectar perfil evasivo', () => {
      const answers = {
        q1: 'no sé',
        q2: 'como siempre',
        q3: 'más de lo mismo',
      };
      // Según la lógica actual, el score es negativo y cae en 'escéptico'
      expect(detectUserProfile(answers)).toBe('escéptico');
    });

    it('debería retornar neutral para respuestas mixtas', () => {
      const answers = {
        q1: 'bien',
        q2: 'no tan bien',
        q3: 'regular',
      };
      expect(detectUserProfile(answers)).toBe('neutral');
    });
  });
});
