import { html } from '../preact.js';
import { useWeather } from '../weather.js';
import { getDayName, getDate, getHour } from '../utils.js';

const Hour = ({ data }) => {
  const {
    date,
    temperatureStr, feelsLikeStr,
    precipitation, precipitationStr,
    rain, rainStr,
    snowfall, snowfallStr,
    showers, showersStr,
    weatherStr
  } = data;

  return html`<div style="border: 1px solid gray; padding: 10px; margin: 10px; border-radius: 10px" >
    <div>${getDayName(date)} (${getDate(date)}) ${getHour(date)}, ${weatherStr}<//>
    <div><b>${temperatureStr}</b>, feels like ${feelsLikeStr}<//>
    ${precipitation > 0 ? html`<div>🌧 ${precipitationStr}<//>` : ''}
    ${rain > 0 ? html`<div>  💧 ${rainStr}<//>` : ''}
    ${snowfall > 0 ? html`<div>  ❄ ${snowfallStr}<//>` : ''}
    ${showers > 0 ? html`<div>  🚿 ${showersStr}<//>` : ''}
  <//>`;
};

export const HourlyForecast = () => {
  const { weather } = useWeather();

  if (!weather.value) {
    return;
  }

  const { hourly } = weather.value;

  return html`
    <div>${hourly.map(data => html`<${Hour} data=${data} />`)}<//>`;
};
