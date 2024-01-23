import { html } from '../preact.js';
import { useLocation } from '../hooks/location.js';
import { useWeather } from '../hooks/weather.js';
import { useStyle } from '../hooks/style.js';
import { Emoji } from './emoji.js';

export const LocationChip = ({ editable = false, autofocus = false, onClick = () => {}, onChange = () => {} } = {}) => {
  const { location } = useLocation();

  const classname = useStyle(`
    $ {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      margin: 1rem var(--side-margins);
      border-radius: 1.5rem;
      width: calc(100% - calc(var(--side-margins) * 2));

      display: flex;
      flex-direction: row;
      flex: 1 100%;
    }

    $ input {
      border: none;
      background: none;
      font-size: 1rem;
      color: var(--foreground);
      width: 100%;
      font-weight: bold;
      margin-left: 0.5rem;
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

  const { description: placeDescription } = location.value;

  const placeholder = editable ? 'Search...' :
    placeDescription ? `${placeDescription}` : 'Unknown location';

  return html`<div class="${classname}" onClick=${onClick}>
    <${Emoji}>🔎<//>
    <input disabled=${!editable} autofocus=${autofocus} placeholder=${placeholder} onChange=${ev => {
      const value = ev.target.value;
      onChange({ value });
    }} />
  <//>`
};

export const LocationDetails = ({ location }) => {
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

  const { latitude, longitude, description: placeDescription, elevation } = location;

  return html`<div class="${classname}">
    ${placeDescription ?
      html`<h2>${placeDescription}<//>` :
      html`<h2>Unknown location<//>`
    }
    <div class="dim">${latitude}, ${longitude}<//>
    ${elevation !== undefined ? html`<div class="dim">Elevation: ${elevation} meters<//>` : null}
  <//>`;
};

export const CurrentLocation = () => {
  const { location } = useLocation();
  const { weather } = useWeather();

  if (!location.value) {
    return;
  }

  const { elevation } = weather.value || {};

  const data = { ...location.value, elevation };

  return html`<${LocationDetails} location=${data} />`;
};
