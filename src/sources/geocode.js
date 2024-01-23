import { fetchOk } from "../utils.js";

export const geocode = async search => {
  const res = await fetchOk(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=10&language=en&format=json`);
  const { results } = await res.json();

  return results.map(place => ({
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    description: [
      place.admin1,
      // place.admin2,
      // place.admin3,
      // place.admin4,
      place.country
    ].filter(a => !!a).join(', ')
  }));
};
