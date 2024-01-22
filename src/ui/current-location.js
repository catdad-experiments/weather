import { html } from '../preact.js';
import { useLocation } from '../hooks/location.js';
import { useWeather } from '../hooks/weather.js';
import { useStyle } from '../hooks/style.js';

export const LocationChip = ({ editable = false, onClick = () => {} } = {}) => {
  const { location } = useLocation();

  const classname = useStyle(`
    $ {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      margin: 1rem 0;
      border-radius: 1.5rem;
      width: 100%;
    }

    $ input {
      border: none;
      background: none;
      font-size: 1rem;
      color: var(--foreground);
    }

    $ input::placeholder {
      color: var(--foreground);
    }

    $ input:disabled {
      color: var(--foreground);
      opacity: 1;
    }
  `);

  const { latitude, longitude, city, locality } = location.value;

  return html`<div class="${classname}" onClick=${onClick}>
    <input disabled=${!editable} placeholder=${`${locality}, ${city}`} />
  <//>`
};

export const CurrentLocation = () => {
  const { location } = useLocation();
  const { weather } = useWeather();

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
