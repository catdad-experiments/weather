import { html } from '../preact.js';
import { useWeather } from "../hooks/weather.js";
import { getDateTime } from "../utils.js";

import { CurrentLocation } from "../ui/current-location.js";
import { CurrentWeather } from "../ui/current-weather.js";
import { DailyForecast } from "../ui/daily-forecast.js";

export const Forecast = () => {
  const { location, weather,  } = useWeather();

  if (!location.value || !weather.value) {
    return html`<div>Working on it...</div>`;
  }

  return html`
    <${CurrentLocation} />
    <${CurrentWeather} />
    <div>
      refreshed: ${getDateTime(weather.value.date)}
      <span> <//>
      <button onclick=${() => {
        location.value = {...location.value};
      }}>refresh now<//>
    <//>
    <${DailyForecast} />
    <div><a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a><//>
  `;
};
