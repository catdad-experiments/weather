import { html } from '../preact.js';
import { useWeather } from '../weather.js';
import { getHour } from '../utils.js';
import { Emoji } from './emoji.js';
import { useStyle } from '../style.js';

const nbsp = '\xa0';
const noWrap = str => str.replace(/ /g, nbsp);

const Hour = ({ data }) => {
  const {
    date,
    temperatureStr, feelsLikeStr,
    precipitation, precipitationStr,
    snowfall, snowfallStr,
    weatherStr, weatherIcon
  } = data;

  const precipIcon = snowfall > 0 ? '❄' : '🌧';

  return html`<div class="hour">
    <div>${getHour(date).toLowerCase()}<//>
    <div class="center"><${Emoji}>${weatherIcon}<//> ${noWrap(weatherStr)}<//>
    <div class="center wrap">${noWrap(temperatureStr)} <span class="dim" title="feels like">(${noWrap(feelsLikeStr)})<//><//>
    <div><${Emoji}>${precipIcon}<//> ${precipitationStr}<//>
  <//>`;
};

export const HourlyForecast = ({ hourly = [] } = {}) => {
  const { weather } = useWeather();

  const classname = useStyle(`
    $ .hour {
      --time-column: 60px;
      --precip-column: 85px;

      padding: 10px;
      display: grid;
      grid-template-columns: var(--time-column) 1fr 1fr var(--precip-column);
      width: 100%;
      line-height: 1;
    }

    $ .hour:nth-child(even) {
      background: rgba(255,255,255,0.1);
      border-radius: 5px;
    }

    $ .hour:first-of-type {
      margin-top: 10px;
    }

    $ .center {
      text-align: center;
    }

    $ .dim {
      opacity: var(--dim);
    }

    @media (max-width: 560px) {
      $ {
        grid-template-columns: var(--time-column) 2fr 1fr var(--precip-column);
      }

      $ .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  `);

  if (!weather.value) {
    return;
  }

  return html`<div class="${classname}">
    ${hourly.map(data => html`<${Hour} data=${data} />`)}
  <//>`;
};
