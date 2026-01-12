const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    specPattern: '**/*.cy.js',
    excludeSpecPattern: ['**/node_modules/**'],
    supportFile: false,
    video: false,
  },
});