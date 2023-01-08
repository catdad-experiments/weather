import { html } from '../preact.js';
import { useWeather } from '../weather.js';

const dayName = date => date.toLocaleDateString(navigator.language, { weekday: 'short' });

export const DailyForecast = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { daily } = weather.value;

  const elems = [];

  for (const data of daily) {
    const {
      date,
      temperatureMinStr, temperatureMaxStr,
      feelsLikeMinStr, feelsLikeMaxStr,
      precipitation, precipitationStr,
      weatherStr,
      sunrise, sunset
    } = data;

    elems.push(html`<div style="border: 1px solid gray; padding: 10px; margin: 10px; border-radius: 10px" >
      <div>${dayName(date)} - ${weatherStr}<//>
      <div>${temperatureMinStr} (${feelsLikeMinStr}) / ${temperatureMaxStr} (${feelsLikeMaxStr})<//>
      ${precipitation > 0 ? html`<div>🌧 ${precipitationStr}<//>` : ''}
      <div>☀⬆: ${getTime(sunrise)}, ☀⬇: ${getTime(sunset)}<//>
    <//>`);
  }

  return html`<div>${elems}<//>`;
};
