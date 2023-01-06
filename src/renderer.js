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

  const { current_weather } = weather.value;
  const { temperature_2m: tempUnit } = weather.value.hourly_units;

  // TODO current feels-like, etc.
  return html`<div>Current temperature: ${current_weather.temperature}${tempUnit}<//>`;
};

const HourlyForecast = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { hourly } = weather.value;
  const { temperature_2m: tempUnit, precipitation: precipUnit } = weather.value.hourly_units;

  const elems = [];

  for (const i in hourly.time) {
    const [time, temp, feelsLike, precipitation] = [hourly.time[i], hourly.temperature_2m[i], hourly.apparent_temperature[i], hourly.precipitation[i]];

    elems.push(html`<div>${time}: ${temp}${tempUnit} (${feelsLike}${tempUnit}) ${precipitation > 0 ? `💧 ${precipitation} ${precipUnit}` : ''} <//>`);
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
