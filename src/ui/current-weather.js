import { html } from '../preact.js';
import { useWeather } from '../weather.js';
import { Emoji } from './emoji.js';
import { useStyle } from '../style.js';

export const CurrentWeather = () => {
  const { weather } = useWeather();

  const classname = useStyle(`
    $ {
      text-align: center;
    }

    $ .dim {
      opacity: 0.7;
    }
  `);

  if (!weather.value) {
    return;
  }

  const { current } = weather.value;

  // TODO current feels-like, etc.
  return html`<div class="${classname}">
    <h2><${Emoji} style="font-size: 1.2em">${current.weatherIcon}<//> ${current.weatherStr}, ${current.temperatureStr}<//>
    <p class="dim">feels like ${current.feelsLikeStr}<//>
  <//>`;
};
