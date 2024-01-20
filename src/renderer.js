import { html, render } from './preact.js';
import { useWeather, withWeather } from './hooks/weather.js';
import { getDateTime } from './utils.js';
import { useRoutes, withRoutes } from './hooks/routes.js';

import { Location } from './ui/location.js';
import { CurrentWeather } from './ui/current-weather.js';
import { DailyForecast } from './ui/daily-forecast.js';

const Router = () => {
  const { route } = useRoutes();
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

  // TODO allow user to manually trigger location fetching or type a location name
  return html`<div>Working on it...</div>`;
};

const App = withRoutes(withWeather(() => html`<${Router} />`));

export default () => {
  render(html`<${App} />`, document.querySelector('#main'));
  return () => { };
};
