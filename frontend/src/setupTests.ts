import '@testing-library/jest-dom';
import * as React from 'react';

// Expose React as a global for components that rely on it being in scope
(global as any).React = React;

// jsdom doesn't implement scrollIntoView; add a harmless stub for tests
(global as any).HTMLElement.prototype.scrollIntoView = function () {};

// Provide a lightweight global `fetch` stub so tests that import services
// which call `fetch` do not perform real network requests during unit tests.
// Save the original (if present) so tests can restore it when needed.
(global as any).__originalFetch = (global as any).fetch;
(global as any).fetch = async () => ({
	ok: true,
	json: async () => [],
	text: async () => '[]',
});
