import '@testing-library/jest-dom';

// jsdom does not implement scrollIntoView — provide a no-op mock so tests
// that render components using it (e.g. ChatWindow) don't throw.
window.HTMLElement.prototype.scrollIntoView = () => {};

