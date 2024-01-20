import { html } from '../preact.js';
import { useWeather } from '../hooks/weather.js';
import { Emoji } from './emoji.js';
import { useStyle } from '../hooks/style.js';

export const CurrentWeather = () => {
  const { weather } = useWeather();

  const classname = useStyle(`
    $ {
      text-align: center;
    }

    $ .dim {
      opacity: var(--dim);
    }

    $ .flex {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    $ .row {
      flex-direction: row;
    }

    $ .column {
      flex-direction: column;
    }
  `);

  if (!weather.value) {
    return;
  }

  const { current } = weather.value;

  return html`<div class="${classname}">
    <div class="flex row">
      <${Emoji} style="font-size: 4.5em">${current.weatherIcon}<//>
      <div class="flex column">
        <span style="font-size: 2em; line-height: 1.2">${current.temperatureStr}<//>
        <span class="dim" style="font-size: 0.9em; line-height: 2">feels ${current.feelsLikeStr}<//>
      <//>
    <//>
    <div style="font-size: 1.5em; margin: 0.4rem 0 1rem 0;">${current.weatherStr}<//>
  <//>`;
};
