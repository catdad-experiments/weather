import { fetchOk } from "../utils.js";

export const getPosition = async () => {
  const position = await new Promise((resolve, reject) => {
    // note: look into using watchPosition()
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });

  const { latitude, longitude } = position.coords;

  const data = { latitude, longitude };

  try {
    const res = await fetchOk(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`);
    const json = await res.json();

    const { locality, city } = json;

    Object.assign(data, { city, locality });
  } catch (e) {};

  console.log('🎯', data);

  return data;
};
