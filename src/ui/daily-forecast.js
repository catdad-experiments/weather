import { html } from '../preact.js';
import { useWeather } from '../weather.js';
import { getDayName, getDate, getTime } from '../utils.js';

const Day = ({ data }) => {
  const {
    date,
    temperatureMinStr, temperatureMaxStr,
    feelsLikeMinStr, feelsLikeMaxStr,
    precipitation, precipitationStr,
    weatherStr,
    sunrise, sunset
  } = data;

  return html`<div style="border: 1px solid gray; padding: 10px; margin: 10px; border-radius: 10px" >
    <div>${getDayName(date, 'long')} (${getDate(date)}) - ${weatherStr}<//>
    <div>${temperatureMinStr} (${feelsLikeMinStr}) / ${temperatureMaxStr} (${feelsLikeMaxStr})<//>
    ${precipitation > 0 ? html`<div>🌧 ${precipitationStr}<//>` : ''}
    <div>☀⬆: ${getTime(sunrise)}, ☀⬇: ${getTime(sunset)}<//>
  <//>`;
};

export const DailyForecast = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { daily } = weather.value;

  return html`<div>${daily.map(data => html`<${Day} data=${data} />`)}<//>`;
};
