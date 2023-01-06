import { createContext, useContext, useEffect, html, signal, effect, useSignal } from './preact.js';
import { getWeather } from './sources/weather.js';
import { getPosition } from './sources/position.js';

const Weather = createContext({});

export const withWeather = Component => ({ children, ...props }) => {
  const location = useSignal(null);
  const weather = useSignal(null);
  const temperatureUnit = useSignal('fahrenheit'); // celsius, fahrenheit
  const windspeedUnit = useSignal('mph'); // kmh, ms, mph, kn,
  const precipitationUnit = useSignal('inch'); // mm, inch

  // when coordinates change, fetch the new weather
  effect(() => {
    if (!location.value) {
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

    getWeather(query).then(result => {
      weather.value = result;
    }).catch(err => {
      // TODO
      console.error('failed to fetch weather data:', err);
    });
  });

  useEffect(() => {
    getPosition().then(position => {
      location.value = { ...position };
    }).catch(err => {
      // TODO
      console.error('failed to get position:', err);
    });
  }, []);

  return html`
    <${Weather.Provider} value=${{ location, weather }}>
      <${Component} ...${props}>${children}<//>
    <//>
  `;
};

export const useWeather = () => useContext(Weather);
