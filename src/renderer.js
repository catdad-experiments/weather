import { html, render, useState, useEffect, useRef } from './preact.js';
import { useWeather, withWeather } from './weather.js';

const isLocalhost = () => !!/^localhost:[0-9]+$/.test(location.host);

const App = withWeather(() => {
  const { coords } = useWeather();

  if (coords.value) {
    return html`<div>currently at: ${coords.value.latitude}, ${coords.value.longitude}<//>`;
  }

  return html`<div>Working on it...</div>`;
});

export default () => {
  render(html`<${App} />`, document.querySelector('#main'));
  return () => { };
};
