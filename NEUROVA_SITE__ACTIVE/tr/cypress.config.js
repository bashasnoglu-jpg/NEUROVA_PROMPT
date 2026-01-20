const { defineConfig } = require("cypress");
const { lighthouse, prepareAudit } = require("cypress-audit");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    supportFile: 'tests/support/e2e.js',
    specPattern: '**/*.cy.js',
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });
      on("task", {
        lighthouse: lighthouse(),
      });
    },
  },
});