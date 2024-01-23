import { createContext, useContext, html, effect, useSignal } from '../preact.js';
import { getForecast } from '../sources/forecast.js';

import { useLocation } from './location.js';

const Weather = createContext({});

export const withWeather = Component => ({ children, ...props }) => {
  const { location } = useLocation();
  const weather = useSignal(null);
  const temperatureUnit = useSignal('fahrenheit'); // celsius, fahrenheit
  const windspeedUnit = useSignal('mph'); // kmh, ms, mph, kn,
  const precipitationUnit = useSignal('inch'); // mm, inch

  // when coordinates change, fetch the new weather
  effect(() => {
    if (!('latitude' in location.value)) {
      return;
    }

    const { latitude, longitude } = location.value;

    const query = {
      latitude,
      longitude,
      temperature_unit: temperatureUnit.value,
      windspeed_unit: windspeedUnit.value,
      precipitation_unit: precipitationUnit.value
    };

    getForecast(query).then(result => {
      weather.value = result;
    }).catch(err => {
      // TODO
      console.error('failed to fetch weather data:', err);
    });
  });

  return html`
    <${Weather.Provider} value=${{ weather }}>
      <${Component} ...${props}>${children}<//>
    <//>
  `;
};

export const useWeather = () => useContext(Weather);
