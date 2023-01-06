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

    const city = json.city;
    const administrative = json.localityInfo.administrative.sort((a, b) => a.adminLevel - b.adminLevel || a.order - b.order).pop().name;
    const informative = json.localityInfo.informative.sort((a, b) => a.order - b.order).pop().name;

    Object.assign(data, { city, administrative, informative });
  } catch (e) {};

  console.log('🎯', data);

  return data;
};
