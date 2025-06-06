import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from './app/page';

test('renderiza el título', () => {
  render(<Page />);
  // Ajusta el texto esperado según el contenido real de tu página principal
  expect(screen.getByText(/demo workflow conversacional/i)).toBeInTheDocument();
});
