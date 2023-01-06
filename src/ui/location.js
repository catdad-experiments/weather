import { html } from '../preact.js';
import { useWeather } from '../weather.js';

export const Location = () => {
  const { location, weather } = useWeather();

  if (!location.value) {
    return;
  }

  const { latitude, longitude, informative, administrative } = location.value;
  const { elevation } = weather.value || {};

  const locationStr = administrative ? `${administrative} (${informative}) [${latitude}, ${longitude}]` : `${latitude}, ${longitude}`;

  return html`<div>Location: ${locationStr} ${elevation !== undefined ? ` | Elevation: ${elevation}` : ''}<//>`;
};
