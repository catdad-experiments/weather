import { html } from '../preact.js';
import { useWeather } from '../weather.js';

export const HourlyForecast = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { hourly } = weather.value;

  const elems = [];

  for (const data of hourly) {
    const { time, temperatureStr, feelsLikeStr, precipitation, precipitationStr } = data;

    elems.push(html`<div>${time}: ${temperatureStr} (${feelsLikeStr}) ${precipitation > 0 ? `💧 ${precipitationStr}` : ''} <//>`);
  }

  return html`<div>${elems}<//>`;
};
