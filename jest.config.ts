import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};

export default config;
