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
    const {
      date,
      temperatureStr, feelsLikeStr,
      precipitation, precipitationStr,
      rain, rainStr,
      snowfall, snowfallStr,
      showers, showersStr,
      weatherStr
    } = data;

    // don't show time that has already passed
    if (date < new Date()) {
      continue;
    }

    elems.push(html`<div style="border: 1px solid gray; padding: 10px; margin: 10px; border-radius: 10px" >
      <div>${dayName(date)} ${hour(date)}, ${weatherStr}<//>
      <div><b>${temperatureStr}</b>, feels like ${feelsLikeStr}<//>
      ${precipitation > 0 ? html`<div>🌧 ${precipitationStr}<//>` : ''}
      ${rain > 0 ? html`<div>  💧 ${rainStr}<//>` : ''}
      ${snowfall > 0 ? html`<div>  ❄ ${snowfallStr}<//>` : ''}
      ${showers > 0 ? html`<div>  🚿 ${showersStr}<//>` : ''}
    <//>`);
  }

  return html`<div>${elems}<//>`;
};
