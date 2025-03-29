import { TextEncoder, TextDecoder } from "util";
import "fake-indexeddb/auto";
import "@testing-library/jest-dom";

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
if (typeof global.structuredClone !== "function") {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}
// Polyfill for TextEncoder
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof window.TextEncoder === "undefined") {
  window.TextEncoder = global.TextEncoder;
}

// Polyfill for TextDecoder
if (typeof global.TextDecoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  global.TextDecoder = TextDecoder;
}
if (typeof window.TextDecoder === "undefined") {
  window.TextDecoder = global.TextDecoder;
}
