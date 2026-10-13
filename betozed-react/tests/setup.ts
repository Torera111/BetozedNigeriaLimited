import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

Object.defineProperty(window, 'matchMedia', { writable: true, value: vi.fn((query: string) => ({ matches: false, media: query, onchange: null, addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() })) });
Object.defineProperty(URL, 'createObjectURL', { writable: true, value: vi.fn(() => 'blob:test-enquiry') });
Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: vi.fn() });

window.requestAnimationFrame = (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0);
