import { html } from '../preact.js';
import { useWeather } from '../weather.js';

export const Location = () => {
  const { location, weather } = useWeather();

  if (!location.value) {
    return;
  }

  const { latitude, longitude, informative, administrative } = location.value;
  const { elevation } = weather.value || {};

  return html`
    ${administrative ?
      html`<h2>${administrative} (${informative})<//>` :
      html`<h2>Unknown location<//>`
    }
    <sub>${latitude}, ${longitude}<//>
    <p>Elevation: ${elevation}<//>
  `;
};
