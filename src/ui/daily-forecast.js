import { html, useSignal } from '../preact.js';
import { useWeather } from '../weather.js';
import { getDayName, getDate, getTime } from '../utils.js';
import { Emoji } from './emoji.js';
import { HourlyForecast } from './hourly-forecast.js';

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

  return html`<div style="border: 1px solid gray; padding: 10px; margin: 10px; border-radius: 10px" >
    <p>${getDayName(date, 'long')} (${getDate(date)}) - <${Emoji}>${weatherIcon}<//> ${weatherStr}<//>
    <div><b>${temperatureMaxStr} / ${temperatureMinStr}</b><//>
    <div><i>feels like ${feelsLikeMaxStr} / ${feelsLikeMinStr}</i><//>
    ${precipitation > 0 ? html`<div>🌧 ${precipitationStr}<//>` : ''}
    <div><${Emoji}>☀⬆<//>: ${getTime(sunrise)}, <${Emoji}>☀⬇<//>: ${getTime(sunset)}<//>
    <p>
      <button onclick=${() => { hourlyVisible.value = !hourlyVisible.value; }}>Toggle hourly<//>
      ${hourlyVisible.value ? html`<${HourlyForecast} hourly=${hourly} />` : ''}
    <//>
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
