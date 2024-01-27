import { fetchOk } from "../utils.js";

export const lookupPosition = async ({ latitude, longitude }) => {
  const res = await fetchOk(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`);
  const json = await res.json();

  console.log('📍', json);

  const { locality, city } = json;

  return { latitude, longitude, description: `${locality}, ${city}` };
};

export const getPosition = async () => {
  const position = await new Promise((resolve, reject) => {
    // note: look into using watchPosition()
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  const { latitude, longitude } = position.coords;

  let data = { latitude, longitude };

  try {
    data = await lookupPosition({ latitude, longitude });
  } catch (e) {};

  console.log('🎯', data);

  return data;
};
