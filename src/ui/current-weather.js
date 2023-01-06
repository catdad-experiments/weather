import { html } from '../preact.js';
import { useWeather } from '../weather.js';

export const CurrentWeather = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { current } = weather.value;

  // TODO current feels-like, etc.
  return html`
    <p>${current.temperatureStr}<//>
    <p>${current.weatherStr}<//>
  `;
};
