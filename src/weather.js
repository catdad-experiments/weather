import { createContext, useContext, useEffect, html, signal, effect, useSignal } from './preact.js';
import { fetchOk } from './utils.js';

const getPosition = async () => {
  const position = await new Promise((resolve, reject) => {
    // note: look into using watchPosition()
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  const { latitude, longitude } = position.coords;

  const data = { latitude, longitude };

  try {
    const res = await fetchOk(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`);
    const json = await res.json();

    const city = json.city;
    const administrative = json.localityInfo.administrative.sort((a, b) => a.adminLevel - b.adminLevel || a.order - b.order).pop().name;
    const informative = json.localityInfo.informative.sort((a, b) => a.order - b.order).pop().name;

    Object.assign(data, { city, administrative, informative });
  } catch (e) {};

  console.log('🎯', data);

  return data;
};

const getWeather = async (query) => {
  const queryString = Object.entries({
    ...query,
    current_weather: true,
    hourly: 'temperature_2m,apparent_temperature,precipitation,visibility',
    timezone: 'auto'
  }).map(([key, value]) => `${key}=${value}`).join('&');

  const tempUnit = ({ celcius: '°C', fahrenheit: '°F'})[query.temperature_unit];
  const precipUnit = ({ inch: 'in', mm: 'mm' })[query.precipitation_unit];

  const res = await fetchOk(`https://api.open-meteo.com/v1/forecast?${queryString}`);
  const json = await res.json();

  console.log('⛅:', json);

  // let's clean up the data so it makes a bit more sense

  const { elevation, current_weather, hourly, hourly_units } = json;
  const hourlyMap = [];

  for (const i in hourly.time) {
    hourlyMap.push({
      time: hourly.time[i],
      date: new Date(hourly.time[i]),
      temperature: hourly.temperature_2m[i],
      temperatureStr: `${hourly.temperature_2m[i]} ${tempUnit}`,
      feelsLike: hourly.apparent_temperature[i],
      feelsLikeStr: `${hourly.apparent_temperature[i]} ${tempUnit}`,
      precipitation: hourly.precipitation[i],
      precipitationStr: `${hourly.precipitation[i]} ${precipUnit}`,
      visibility: hourly.visibility[i],
      visibilityStr: `${hourly.visibility[i]} meters`
    });
  }

  const current = {
    temperature: current_weather.temperature,
    temperatureStr: `${current_weather.temperature} ${tempUnit}`
  };

  return {
    elevation,
    current,
    hourly: hourlyMap
  };
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
