module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "docs/coverage",
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  }
};
