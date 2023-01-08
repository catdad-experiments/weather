import { fetchOk, getDay } from "../utils.js";

// https://open-meteo.com/en/docs
const codes = {
  0: { name: 'Clear sky', icon: '☀' },
  1: { name: 'Mainly clear', icon: '🌤' },
  2: { name: 'Partly cloudy', icon: '⛅' },
  3: { name: 'Overcast', icon: '☁' },

  45: { name: 'Fog', icon: '🌫' },
  48: { name: 'Depositing rime fog', icon: '🌫' },

  51: { name: 'Light drizzle', icon: '🌦' },
  53: { name: 'Moderate drizzle', icon: '🌦' },
  55: { name: 'Dense drizzle', icon: '🌦' },
  56: { name: 'Light freezing drizzle', icon: '🌨' },
  57: { name: 'Dense freezing drizzle', icon: '🌨' },

  61: { name: 'Slight rain', icon: '🌧' },
  63: { name: 'Moderate rain', icon: '🌧' },
  65: { name: 'Heavy rain', icon: '🌧' },
  66: { name: 'Light freezing rain', icon: '🌨' },
  67: { name: 'Heavy freezing rain', icon: '🌨' },

  71: { name: 'Slight snow fall', icon: '❄' },
  73: { name: 'Moderate snow fall', icon: '❄' },
  75: { name: 'Heavy snow fall', icon: '❄' },
  77:	{ name: 'Snow grains', icon: '❄' },

  80: { name: 'Slight rain showers', icon: '🌦' },
  81: { name: 'Moderate rain showers', icon: '🌦' },
  82: { name: 'Violent rain showers', icon: '🌦' },

  85: { name: 'Slight snow showers', icon: '🌨' },
  86: { name: 'Heavy show showers', icon: '🌨' },

  // only available in Europe
  95: { name: 'Thunderstorm', icon: '⚡' },
  96: { name: 'Thunderstorm with slight hail', icon: '⛈' },
  99: { name: 'Thunderstorm with heavy hail', icon: '⛈' },
};

export const getForecast = async (query) => {
  const now = new Date();
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
  const dailyMap = [];

  for (const i in daily.time) {
    dailyMap.push({
      // time needs to be added to the date, because time zone issues
      day: daily.time[i],
      date: new Date(`${daily.time[i]}T00:00`),
      sunrise: new Date(daily.sunrise[i]),
      sunset: new Date(daily.sunset[i]),
      weather: daily.weathercode[i],
      weatherStr: codes[daily.weathercode[i]].name,
      weatherIcon: codes[daily.weathercode[i]].icon,
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

      hourly: []
    });
  }

  for (const i in hourly.time) {
    const date = new Date(hourly.time[i]);
    const day = getDay(date);
    const hourlyMap = dailyMap.find(d => d.day === day).hourly;

    hourlyMap.push({
      date,
      temperature: hourly.temperature_2m[i],
      temperatureStr: `${hourly.temperature_2m[i]} ${tempUnit}`,
      feelsLike: hourly.apparent_temperature[i],
      feelsLikeStr: `${hourly.apparent_temperature[i]} ${tempUnit}`,
      visibility: hourly.visibility[i],
      visibilityStr: `${hourly.visibility[i]} meters`,
      weather: hourly.weathercode[i],
      weatherStr: codes[hourly.weathercode[i]].name,
      weatherIcon: codes[hourly.weathercode[i]].icon,

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

  const current = {
    temperature: current_weather.temperature,
    temperatureStr: `${current_weather.temperature} ${tempUnit}`,
    weatherCode: current_weather.weathercode,
    weatherStr: codes[current_weather.weathercode].name,
    weatherIcon: codes[current_weather.weathercode].icon,
  };

  return {
    date: now,
    elevation,
    current,
    daily: dailyMap
  };
};
