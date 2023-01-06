import { html, render, useState, useEffect, useRef } from './preact.js';

const isLocalhost = () => !!/^localhost:[0-9]+$/.test(location.host);

export default () => {
  const elem = document.querySelector('#main');

  const ui = html`<div>This is the app</div>`;

  render(ui, elem);

  return () => {};
};
