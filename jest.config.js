module.exports = {
    rootDir: './',
    preset: 'ts-jest',
    testEnvironment: 'node',
    // Optionally map .ts and .tsx files to use ts-jest
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
      '^.+\\.ts?$': 'ts-jest',
    },
  };
  