import { html } from '../preact.js';
import { useLocation } from '../hooks/location.js';
import { useWeather } from '../hooks/weather.js';
import { useStyle } from '../hooks/style.js';
import { useEmojiFont } from './emoji.js';

export const LocationChip = ({ editable = false, autofocus = false, onClick = () => {}, onChange = () => {} } = {}) => {
  const { location } = useLocation();

  const emojiFont = useEmojiFont();

  const classname = useStyle(`
    $ {
      margin: 1rem var(--side-margins);
      width: calc(100% - calc(var(--side-margins) * 2));
      position: relative;
    }

    $:after {
      content: var(--icon);
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 50%;
      transform: translate(0px, -50%);
      left: 1rem;
      width: 1rem;
      font-family: ${emojiFont};
    }

    $ input {
      border: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 1.5rem;

      font-size: 1rem;
      color: var(--foreground);
      width: 100%;
      font-weight: bold;
      padding: 0.5rem 1rem 0.5rem 2.75rem;
    }

    $ input::placeholder {
      color: var(--foreground);
    }

    $ input:disabled {
      color: var(--foreground);
      opacity: 1;
      pointer-events: none;
    }

    $ input:focus {
      border: none;
      outline: none;
      box-shadow: 0 0 4px 0px var(--background), 0 0 8px -2px var(--foreground);
    }
  `);

  const { description: placeDescription, type: locationType } = location.value;

  const placeholder = editable ? 'Search for a location' :
    placeDescription ? `${placeDescription}` : 'Unknown location';

  const emoji = editable ? '🔎' : locationType === 'device' ? '📍' : '🗺';

  return html`<div class="${classname}" style="--icon: '${emoji}'" onClick=${onClick}>
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
