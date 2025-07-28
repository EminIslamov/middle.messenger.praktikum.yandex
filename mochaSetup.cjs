// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM("<!DOCTYPE html><html><body></body></html>");

globalThis.window = jsdom.window;
globalThis.document = jsdom.window.document;
globalThis.FormData = jsdom.window.FormData;
