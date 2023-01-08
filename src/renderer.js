import { html, render } from './preact.js';
import { useWeather, withWeather } from './weather.js';
import { getDateTime } from './utils.js';

import { Location } from './ui/location.js';
import { CurrentWeather } from './ui/current-weather.js';
import { DailyForecast } from './ui/daily-forecast.js';

const App = withWeather(() => {
  const { location, weather,  } = useWeather();

  if (weather.value) {
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
  }

  if (location.value) {
    return html`<${Location} />`;
  }

  return html`<div>Working on it...</div>`;
});

export default () => {
  render(html`<${App} />`, document.querySelector('#main'));
  return () => { };
};
