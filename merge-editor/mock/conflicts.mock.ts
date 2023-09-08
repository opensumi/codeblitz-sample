export const ancestorContent = `
module.exports = {
    preset: 'ts-jest',
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'lcov', 'text'],
    collectCoverageFrom: [
        'packages/*/src/**/*.ts',
        '!packages/toolkit/**',
        '!packages/core/.kaitian/**',
        '!packages/core/extensions/**',
    ],
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    moduleNameMapper: {
        '^@codeblitzjs/ide-core-(?!browserfs)(.*?)$': '<rootDir>/packages/$1/src',
        '^@codeblitzjs/ide-core$': '<rootDir>/packages/core/src',
        '\\.(css|less)$': '<rootDir>/mocks/styleMock.js',
    },
    rootDir: __dirname,
    testMatch: ['<rootDir>/packages/**/__tests__/**/*@(test|spec).[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['./jest.setup.js'],
};
`

export const input1Content = `
module.exports = {
    preset: 'ts-jest',
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'lcov', 'text'],
    watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    moduleNameMapper: {
        '^@codeblitzjs/ide-core-(?!browserfs)(.*?)$': '<rootDir>/packages/$1/src',
        '^@codeblitzjs/ide-core$': '<rootDir>/packages/core/src',
        '\\.(css|less)$': '<rootDir>/mocks/styleMock.js',
    },
    rootDir: __dirname,
    testMatch: ['<rootDir>/packages/**/__tests__/**/*@(test|spec).[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['./jest.setup.js'],
};
`

export const input2Content = `
module.exports = {
    preset: 'ts-jest',
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'lcov', 'text', 'js'],
    collectCoverageFrom: [
        'packages/*/src/**/*.ts',
        '!packages/toolkit/**',
        '!packages/core/.kaitian/**',
        '!packages/core/extensions/**',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    
    moduleNameMapper: {
        '^@codeblitzjs/ide-core-(?!browserfs)(.*?)$': '<rootDir>/packages/$1/src',
        '^@codeblitzjs/ide-core$': '<rootDir>/packages/core/src/ccccccc',
        '\\.(css|less)$': '<rootDir>/mocks/styleMock.js',
    },
    testMatch: ['<rootDir>/packages/**/__tests__/**/*@(test|spec).[jt]s?(x)'],
    testPathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['./jest.setup.js'],
};
`