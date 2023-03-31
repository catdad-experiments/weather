import { html } from '../preact.js';
import { useWeather } from '../weather.js';
import { useStyle } from '../style.js';

export const Location = () => {
  const { location, weather } = useWeather();

  const classname = useStyle(`
    $ {
      text-align: center;
      margin: 1rem 0;
    }

    $ h1 {
      padding: 0;
      margin: 0.5rem 0;
      font-size: 2rem;
    }

    $ h2 {
      padding: 0;
      margin: 0.2rem 0;
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

  const { latitude, longitude, informative, administrative, city } = location.value;
  const { elevation } = weather.value || {};

  return html`<div class="${classname}">
    ${administrative ?
      html`
        <h2>${administrative}<//>
        <h3>${city}, ${informative}<//>
      ` :
      html`<h1>Unknown location<//>`
    }
    <div class="dim">${latitude}, ${longitude}<//>
    <div class="dim">Elevation: ${elevation} meters<//>
  <//>`;
};
