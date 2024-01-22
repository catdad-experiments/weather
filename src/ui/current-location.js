import { html } from '../preact.js';
import { useLocation } from '../hooks/location.js';
import { useWeather } from '../hooks/weather.js';
import { useStyle } from '../hooks/style.js';

export const LocationChip = ({ editable = false, onClick = () => {}, onChange = () => {} } = {}) => {
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
      width: 100%;
    }

    $ input::placeholder {
      color: var(--foreground);
    }

    $ input:disabled {
      color: var(--foreground);
      opacity: 1;
      pointer-events: none;
    }
  `);

  const { latitude, longitude, city, locality } = location.value;

  const placeholder = editable ? 'Search...' :
    city && locality ? `${locality}, ${city}` : 'Unknown location';

  return html`<div class="${classname}" onClick=${onClick}>
    <input disabled=${!editable} placeholder=${placeholder} onChange=${ev => {
      const value = ev.target.value;
      onChange({ value });
    }} />
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
