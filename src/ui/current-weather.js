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
  return html`<div>
    <h2><${Emoji} style="font-size: 1.2em">${current.weatherIcon}<//> ${current.weatherStr}<//>
    <h2>${current.temperatureStr}, feels like ${current.feelsLikeStr}<//>
  <//>`;
};
