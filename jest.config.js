module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[tj]sx?$',
  moduleNameMapper: {
    // Handle module aliases (if you're using them)
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Setup files if needed
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
}; 