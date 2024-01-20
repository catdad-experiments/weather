import { html, render } from './preact.js';
import { useWeather, withWeather } from './hooks/weather.js';
import { useRoutes, withRoutes } from './hooks/routes.js';

import { CurrentLocation } from './ui/current-location.js';
import { Forecast } from './pages/forecast.js';

const Router = () => {
  const { route } = useRoutes();
  const { location, weather,  } = useWeather();

  if (weather.value) {
    return html`<${Forecast} />`;
  }

  if (location.value) {
    return html`<${CurrentLocation} />`;
  }

  // TODO allow user to manually trigger location fetching or type a location name
  return html`<div>Working on it...</div>`;
};

const App = withRoutes(withWeather(() => html`<${Router} />`));

export default () => {
  render(html`<${App} />`, document.querySelector('#main'));
  return () => { };
};
