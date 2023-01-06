import { createContext, useContext, useEffect, html, signal, effect, useSignal } from './preact.js';
import { fetchOk } from './fetchOk.js';

const getPosition = async () => {
  const position = await new Promise((resolve, reject) => {
    // note: look into using watchPosition()
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  console.log('🛰', position);

  const { latitude, longitude } = position.coords;

  const data = { latitude, longitude };

  try {
    const res = await fetchOk(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`);
    const json = await res.json();

    console.log('🌐', json);

    const city = json.city;
    const administrative = json.localityInfo.administrative.sort((a, b) => a.adminLevel - b.adminLevel || a.order - b.order).pop().name;
    const informative = json.localityInfo.informative.sort((a, b) => a.order - b.order).pop().name;

    Object.assign(data, { city, administrative, informative });
  } catch (e) {};

  console.log('🏠', data);

  return data;
};

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
      current_weather: true,
      temperature_unit: temperatureUnit.value,
      windspeed_unit: windspeedUnit.value,
      precipitation_unit: precipitationUnit.value,
      hourly: 'temperature_2m,apparent_temperature,precipitation,visibility',
      timezone: 'auto'
    };

    (async () => {
      const queryString = Object.keys(query).map(key => `${key}=${query[key]}`).join('&');

      const res = await fetchOk(`https://api.open-meteo.com/v1/forecast?${queryString}`);
      const json = await res.json();

      console.log('⛅:', json);

      weather.value = json;
    })().catch(err => {
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
