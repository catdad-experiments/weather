import { html } from '../preact.js';
import { useWeather } from '../weather.js';
import { Emoji } from './emoji.js';

export const CurrentWeather = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { current } = weather.value;

  // TODO current feels-like, etc.
  return html`
    <p>${current.temperatureStr}<//>
    <p><${Emoji} style="font-size: 16pt">${current.weatherIcon}<//> ${current.weatherStr}<//>
  `;
};
