const assert = require('assert');

/**
 * A simple example function to demonstrate testing.
 * In a real scenario, you would import functions from your app.js or other modules.
 */
function add(a, b) {
  return a + b;
}

console.log('Running Sample Tests...');

try {
  // Test Case 1: Basic Addition
  assert.strictEqual(add(2, 3), 5, '2 + 3 should equal 5');
  console.log('✔ Test Passed: Basic Addition');

  // Test Case 2: Handling Negatives
  assert.strictEqual(add(-1, 1), 0, '-1 + 1 should equal 0');
  console.log('✔ Test Passed: Handling Negatives');

  console.log('\nAll sample tests passed successfully.');
} catch (error) {
  console.error('\n✘ Test Failed:', error.message);
  process.exit(1);
}