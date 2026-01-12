document.addEventListener('DOMContentLoaded', () => {
  // Global interactions
  console.log('NEUROVA Core: Loaded.');

  // Character Safety Check
  const testString = "ÜüİıŞşĞğÖöÇç";
  if (testString.length !== 12) {
    throw new Error('NEUROVA Critical: UTF-8 Encoding Mismatch.');
  }
});