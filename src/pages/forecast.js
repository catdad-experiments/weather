import { html } from '../preact.js';
import { useWeather } from "../hooks/weather.js";
import { getDateTime } from "../utils.js";

import { Location } from "../ui/location.js";
import { CurrentWeather } from "../ui/current-weather.js";
import { DailyForecast } from "../ui/daily-forecast.js";

export const Forecast = () => {
  const { location, weather,  } = useWeather();

  return html`
    <${Location} />
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
