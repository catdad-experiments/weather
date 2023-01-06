import { html } from '../preact.js';
import { useWeather } from '../weather.js';

const dayName = date => date.toLocaleDateString(navigator.language, { weekday: 'short' });
const hour = date => date.toLocaleTimeString(navigator.language, { hour: '2-digit' });

export const HourlyForecast = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { hourly } = weather.value;

  const elems = [];

  for (const data of hourly) {
    const { date, temperatureStr, feelsLikeStr, precipitation, precipitationStr, weatherStr } = data;

    elems.push(html`<div style="border: 1px solid gray; padding: 10px; margin: 10px; border-radius: 10px" >
      <div>${dayName(date)} ${hour(date)}<//>
      <div>${weatherStr}<//>
      <div>${temperatureStr} (feels like ${feelsLikeStr})<//>
      ${precipitation > 0 ? `💧 ${precipitationStr}` : ''}
    <//>`);
  }

  return html`<div>${elems}<//>`;
};
