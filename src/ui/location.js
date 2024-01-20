import { html } from '../preact.js';
import { useWeather } from '../hooks/weather.js';
import { useStyle } from '../hooks/style.js';

export const Location = () => {
  const { location, weather } = useWeather();

  const classname = useStyle(`
    $ {
      text-align: center;
      margin: 1rem 0;
    }

    $ h2 {
      margin: 0.2rem 0;
      line-height: 2;
      font-size: 1.5rem;
    }

    $ .dim {
      opacity: var(--dim);
      font-size: 0.9rem;
    }
  `);

  if (!location.value) {
    return;
  }

  const { latitude, longitude, city, locality } = location.value;
  const { elevation } = weather.value || {};

  return html`<div class="${classname}">
    ${locality ?
      html`<h2>${locality}, ${city}<//>` :
      html`<h2>Unknown location<//>`
    }
    <div class="dim">${latitude}, ${longitude}<//>
    <div class="dim">Elevation: ${elevation} meters<//>
  <//>`;
};
