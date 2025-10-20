export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/test', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  transform: {},
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.d.js'],
};