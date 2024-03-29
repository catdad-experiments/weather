import { html } from '../preact.js';
import { useWeather } from '../hooks/weather.js';
import { useLocation } from '../hooks/location.js';
import { useRoutes } from '../hooks/routes.js';
import { getDateTime } from "../utils.js";
import { useStyle } from '../hooks/style.js';

import { Scaffold } from '../ui/scaffold.js';
import { LocationChip } from "../ui/current-location.js";
import { CurrentWeather } from "../ui/current-weather.js";
import { DailyForecast } from "../ui/daily-forecast.js";

export const Forecast = () => {
  const { location } = useLocation();
  const { weather, refreshForecast } = useWeather();
  const { route, ROUTES } = useRoutes();

  const classname = useStyle(`
    $ .refresh {
      text-align: center;
      margin: var(--spacing);
    }
  `);

  if (!location.value || !weather.value) {
    return html`<div>Working on it...</div>`;
  }

  const onLocationClick = () => {
    route.value = ROUTES.location;
  };

  return html`<${Scaffold}
    class="${classname}"
    header=${html`<${LocationChip} onClick=${onLocationClick} />`}
  >
    <${CurrentWeather} />
    <${DailyForecast} />
    <div class="refresh">
      refreshed: ${getDateTime(weather.value.date)}
      <span> <//>
      <button onclick=${() => {
        refreshForecast();
      }}>refresh now<//>
    <//>
  <//>`;
};
