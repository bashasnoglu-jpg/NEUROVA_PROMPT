document.addEventListener('DOMContentLoaded', () => {
  // Global interactions
  console.log('NEUROVA Core: Loaded.');

  // Character Safety Check
  const testString = "ÃƒÅ“ÃƒÂ¼Ã„Â°Ã„Â±Ã…ÂÃ…Å¸Ã„ÂÃ„Å¸Ãƒâ€“ÃƒÂ¶Ãƒâ€¡ÃƒÂ§";
  if (testString.length !== 12) {
    throw new Error('NEUROVA Critical: UTF-8 Encoding Mismatch.');
  }
});