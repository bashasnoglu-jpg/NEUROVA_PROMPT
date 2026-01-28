document.addEventListener('DOMContentLoaded', () => {
  // Global interactions
  console.log('SANTIS Core: Loaded.');

  // Character Safety Check
  const testString = "ÃƒÅ“ÃƒÂ¼Ã„Â°Ã„Â±Ã…ÂÃ…Å¸Ã„ÂÃ„Å¸Ãƒâ€“ÃƒÂ¶Ãƒâ€¡Ãƒ§";
  if (testString.length !== 12) {
    throw new Error('SANTIS Critical: UTF-8 Encoding Mismatch.');
  }
});