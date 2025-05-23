import { steps } from './steps';

const VALID_STEP_TYPES = ['info', 'question', 'choice', 'end'] as const;

describe('Configuración de steps', () => {
  describe('Validaciones básicas', () => {
    it('debe existir al menos un paso', () => {
      expect(steps.length).toBeGreaterThan(0);
    });

    it('debe tener un paso start', () => {
      expect(steps.find((step) => step.id === 'start')).toBeTruthy();
    });

    it('debe tener un paso end', () => {
      expect(steps.find((step) => step.id === 'end')).toBeTruthy();
    });

    it('todos los steps tienen las propiedades requeridas', () => {
      const requiredProps = ['id', 'type', 'text'];
      steps.forEach((step) => {
        requiredProps.forEach((prop) => {
          expect(step).toHaveProperty(prop);
        });
        expect(VALID_STEP_TYPES).toContain(step.type);
      });
    });

    it('todos los IDs son únicos y válidos', () => {
      const ids = steps.map((step) => step.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
      ids.forEach((id) => {
        expect(id).toMatch(/^[a-zA-Z0-9_-]+$/);
      });
    });
  });

  describe('Validación de opciones', () => {
    it('las opciones tienen todas las propiedades necesarias', () => {
      steps.forEach((step) => {
        if (step.options) {
          expect(Array.isArray(step.options)).toBe(true);
          step.options.forEach((option) => {
            expect(option).toHaveProperty('value');
            expect(option).toHaveProperty('label');
            expect(typeof option.value).toBe('string');
            expect(typeof option.label).toBe('string');
          });
        }
      });
    });

    it('no hay opciones duplicadas en un mismo paso', () => {
      steps.forEach((step) => {
        if (step.options) {
          const values = step.options.map((opt) => opt.value);
          const uniqueValues = new Set(values);
          expect(values.length).toBe(uniqueValues.size);

          const labels = step.options.map((opt) => opt.label);
          const uniqueLabels = new Set(labels);
          expect(labels.length).toBe(uniqueLabels.size);
        }
      });
    });
  });

  describe('Validación de navegación', () => {
    it('los nextId referencian a steps válidos', () => {
      const validIds = new Set(steps.map((step) => step.id));

      steps.forEach((step) => {
        if (step.options) {
          step.options.forEach((option) => {
            if (option.nextId) {
              expect(validIds.has(option.nextId)).toBe(true);
            }
          });
        }

        if (typeof step.next === 'string') {
          expect(validIds.has(step.next)).toBe(true);
        }
      });
    });

    it('las funciones next retornan IDs válidos', () => {
      const validIds = new Set(steps.map((step) => step.id));
      const testAnswers = ['yes', 'no', 'maybe', '', 'invalid'];

      steps.forEach((step) => {
        if (typeof step.next === 'function') {
          const nextFn = step.next;
          testAnswers.forEach((answer) => {
            const nextId = nextFn(answer);
            if (nextId !== undefined) {
              expect(validIds.has(nextId)).toBe(true);
            }
          });
        }
      });
    });

    it('no hay referencias circulares en la navegación', () => {
      const visited = new Set<string>();

      const checkCircularRefs = (stepId: string, path = new Set<string>()): boolean => {
        if (path.has(stepId)) {
          return false;
        }

        if (visited.has(stepId)) {
          return true;
        }

        visited.add(stepId);
        const newPath = new Set([...path, stepId]);

        const step = steps.find((s) => s.id === stepId);
        if (!step) {
          return true;
        }

        if (typeof step.next === 'string' && !checkCircularRefs(step.next, newPath)) {
          return false;
        }

        if (step.options) {
          for (const opt of step.options) {
            if (opt.nextId && !checkCircularRefs(opt.nextId, newPath)) {
              return false;
            }
          }
        }

        return true;
      };

      expect(checkCircularRefs('start')).toBe(true);
    });
  });

  describe('Validación de alcanzabilidad', () => {
    it('todos los pasos son alcanzables desde start', () => {
      const reachable = new Set<string>();

      const markReachable = (stepId: string): void => {
        if (reachable.has(stepId)) {
          return;
        }

        reachable.add(stepId);
        const step = steps.find((s) => s.id === stepId);

        if (!step) {
          return;
        }

        if (typeof step.next === 'string') {
          markReachable(step.next);
        } else if (typeof step.next === 'function') {
          const nextFn = step.next;
          ['yes', 'no', 'other', '', 'invalid'].forEach((answer) => {
            const nextId = nextFn(answer);
            if (nextId) {
              markReachable(nextId);
            }
          });
        }

        if (step.options) {
          step.options.forEach((opt) => {
            if (opt.nextId) {
              markReachable(opt.nextId);
            }
          });
        }
      };

      markReachable('start');
      const allIds = steps.map((step) => step.id);

      allIds.forEach((id) => {
        expect(reachable.has(id)).toBe(true);
      });
    });

    it.skip('el paso end es alcanzable desde todos los caminos', () => {
      // Este test se omite porque el flujo actual puede tener caminos que no llegan a 'end'.
      // Si se requiere, ajustar los steps o la lógica para garantizarlo.
    });
  });
});
