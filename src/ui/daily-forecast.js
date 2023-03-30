import { html, useSignal } from '../preact.js';
import { useWeather } from '../weather.js';
import { getDayName, getDate, getTime } from '../utils.js';
import { Emoji } from './emoji.js';
import { HourlyForecast } from './hourly-forecast.js';
import { useStyle } from '../style.js';

const Day = ({ data }) => {
  const {
    date,
    temperatureMinStr, temperatureMaxStr,
    feelsLikeMinStr, feelsLikeMaxStr,
    precipitation, precipitationStr,
    weatherStr, weatherIcon,
    sunrise, sunset,
    hourly
  } = data;

  const hourlyVisible = useSignal(false);

  const classname = useStyle(`
    $ {
      position: relative;
      border: 1px solid gray;
      padding: 10px;
      margin: 10px;
      border-radius: 10px;
    }

    $ .toggle {
      position: absolute;
      top: 10px;
      right: 10px;
      user-select: none;
    }

    $ .dim {
      opacity: 0.6
    }
  `);

  return html`<div class=${classname}>
    <div class="toggle" onclick=${() => { hourlyVisible.value = !hourlyVisible.value; }}><${Emoji}>${hourlyVisible.value ? '🔼' : '🔽'}<//><//>

    <div>${getDayName(date, 'long')}, ${getDate(date)} - <${Emoji}>${weatherIcon}<//> ${weatherStr}<//>
    <div><b>${temperatureMaxStr} / ${temperatureMinStr}</b><//>
    <div class="dim">feels like ${feelsLikeMaxStr} / ${feelsLikeMinStr}<//>
    ${precipitation > 0 ? html`<div>🌧 ${precipitationStr}<//>` : ''}
    <div><${Emoji}>🌅<//>: ${getTime(sunrise)}, <${Emoji}>🌇<//>: ${getTime(sunset)}<//>

    ${hourlyVisible.value ? html`<${HourlyForecast} hourly=${hourly} />` : ''}
  <//>`;
};

export const DailyForecast = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { daily } = weather.value;

  return html`<div style="width: 100%">${daily.map(data => html`<${Day} data=${data} />`)}<//>`;
};
