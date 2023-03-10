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

  const classname = useStyle(`
    $ {
      --time-column: 60px;
      --precip-column: 85px;

      padding: 10px;
      display: grid;
      grid-template-columns: var(--time-column) 1fr 1fr var(--precip-column);
      width: 100%;
    }

    $:nth-child(even) {
      background: rgba(255,255,255,0.1);
      border-radius: 5px;
    }

    $ .center {
      text-align: center;
    }

    @media (max-width: 560px) {
      $ {
        grid-template-columns: var(--time-column) 2fr 1fr var(--precip-column);
      }

      $ div.wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  `);

  return html`<div class=${classname}>
    <div>${getHour(date).toLowerCase()}<//>
    <div class="center"><${Emoji}>${weatherIcon}<//> ${noWrap(weatherStr)}<//>
    <div class="center wrap"><b>${noWrap(temperatureStr)}</b> <i title="feels like">(${noWrap(feelsLikeStr)})</i><//>
    <div><${Emoji}>${precipIcon}<//> ${precipitationStr}<//>
  <//>`;
};

export const HourlyForecast = ({ hourly = [] } = {}) => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  return html`<div>${hourly.map(data => html`<${Hour} data=${data} />`)}<//>`;
};
