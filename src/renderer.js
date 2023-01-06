import { html, render, useState, useEffect, useRef } from './preact.js';
import { useWeather, withWeather } from './weather.js';

const isLocalhost = () => !!/^localhost:[0-9]+$/.test(location.host);

const Location = () => {
  const { location, weather } = useWeather();

  if (!location.value) {
    return;
  }

  const { latitude, longitude, informative, administrative } = location.value;
  const { elevation } = weather.value || {};

  const locationStr = administrative ? `${administrative} (${informative}) [${latitude}, ${longitude}]` : `${latitude}, ${longitude}`;

  return html`<div>Location: ${locationStr} ${elevation !== undefined ? ` | Elevation: ${elevation}` : ''}<//>`;
};

const CurrentWeather = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { current } = weather.value;

  // TODO current feels-like, etc.
  return html`<div>Current temperature: ${current.temperatureStr}<//>`;
};

const HourlyForecast = () => {
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

const App = withWeather(() => {
  const { location, weather } = useWeather();

  if (weather.value) {
    return html`
      <${Location} />
      <${CurrentWeather} />
      <${HourlyForecast} />
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
