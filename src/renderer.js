import { html, render } from './preact.js';
import { withLocation } from './hooks/location.js';
import { withWeather } from './hooks/weather.js';
import { useRoutes, withRoutes } from './hooks/routes.js';

import { Forecast } from './pages/forecast.js';

const Router = () => {
  const { route } = useRoutes();

  switch (route.value) {
    case 'forecast':
      return html`<${Forecast} />`;
    default:
      return html`<div>Loading...</div>`;
  }
};

const App = withRoutes(withLocation(withWeather(() => html`<${Router} />`)));

export default () => {
  render(html`<${App} />`, document.querySelector('#main'));
  return () => { };
};
