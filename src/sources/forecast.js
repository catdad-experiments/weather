import { fetchOk } from "../utils.js";

// https://open-meteo.com/en/docs
const codes = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',

  45: 'Fog',
  48: 'depositing rime fog',

  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',

  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezinf rain',

  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77:	'Snow grains',

  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',

  85: 'Slight snow showers',
  86: 'Heavy show showers',

  // only available in Europe
  95: 'Thunderstorm', // Slight or moderate
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

export const getForecast = async (query) => {
  const convertMmToInch = x => query.precipitation_unit === 'inch' ? x / 25.4 : x;

  const queryString = Object.entries({
    ...query,
    // always request in metric, convert if necessary
    precipitation_unit: 'mm',
    current_weather: true,
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation',
      'snowfall',
      'rain',
      'showers',
      'visibility',
      'weathercode'
    ].join(','),
    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'precipitation_sum'
    ].join(','),
    timezone: 'auto'
  }).map(([key, value]) => `${key}=${value}`).join('&');

  const tempUnit = ({ celcius: '°C', fahrenheit: '°F'})[query.temperature_unit];
  const precipUnit = ({ inch: 'in', mm: 'mm' })[query.precipitation_unit];

  const res = await fetchOk(`https://api.open-meteo.com/v1/forecast?${queryString}`);
  const json = await res.json();

  console.log('⛅:', json);

  // let's clean up the data so it makes a bit more sense

  const { elevation, current_weather, hourly, hourly_units, daily, daily_units } = json;
  const hourlyMap = [];
  const dailyMap = [];

  for (const i in hourly.time) {
    hourlyMap.push({
      time: hourly.time[i],
      date: new Date(hourly.time[i]),
      temperature: hourly.temperature_2m[i],
      temperatureStr: `${hourly.temperature_2m[i]} ${tempUnit}`,
      feelsLike: hourly.apparent_temperature[i],
      feelsLikeStr: `${hourly.apparent_temperature[i]} ${tempUnit}`,
      visibility: hourly.visibility[i],
      visibilityStr: `${hourly.visibility[i]} meters`,
      weather: hourly.weathercode[i],
      weatherStr: codes[hourly.weathercode[i]],

      // precipication values, convert if necessary
      precipitation: convertMmToInch(hourly.precipitation[i]),
      precipitationStr: `${convertMmToInch(hourly.precipitation[i])} ${precipUnit}`,
      rain: convertMmToInch(hourly.rain[i]),
      rainStr: `${convertMmToInch(hourly.rain[i])} ${precipUnit}`,
      // snowfall is returned in cm not mm
      snowfall: convertMmToInch(hourly.snowfall[i] / 100),
      snowfallStr: `${convertMmToInch(hourly.snowfall[i] / 100)} ${precipUnit}`,
      showers: convertMmToInch(hourly.showers[i]),
      showersStr: `${convertMmToInch(hourly.showers[i])} ${precipUnit}`,
    });
  }

  for (const i in daily.time) {
    dailyMap.push({
      date: new Date(daily.time[i]),
      sunrise: new Date(daily.sunrise[i]),
      sunset: new Date(daily.sunset[i]),
      weather: daily.weathercode[i],
      weatherStr: codes[daily.weathercode[i]],
      temperatureMin: daily.temperature_2m_min[i],
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMinStr: `${daily.temperature_2m_min[i]} ${tempUnit}`,
      temperatureMaxStr: `${daily.temperature_2m_max[i]} ${tempUnit}`,
      feelsLikeMin: daily.apparent_temperature_min[i],
      feelsLikeMax: daily.apparent_temperature_max[i],
      feelsLikeMinStr: `${daily.apparent_temperature_min[i]} ${tempUnit}`,
      feelsLikeMaxStr: `${daily.apparent_temperature_max[i]} ${tempUnit}`,

      // precipication values, convert if necessary
      precipitationSum: convertMmToInch(daily.precipitation_sum[i]),
      precipitationSumStr: `${convertMmToInch(daily.precipitation_sum[i])} ${precipUnit}`,
    });
  }

  const current = {
    temperature: current_weather.temperature,
    temperatureStr: `${current_weather.temperature} ${tempUnit}`,
    weatherCode: current_weather.weathercode,
    weatherStr: codes[current_weather.weathercode]
  };

  return {
    elevation,
    current,
    hourly: hourlyMap,
    daily: dailyMap
  };
};
