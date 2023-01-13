export const fetchOk = async (url, ...args) => {
  const res = await fetch(url, ...args);

  if (!res.ok) {
    throw new Error(`failed to fetch "${url}": ${res.status} ${res.statusText}`);
  }

  return res;
};

export const isLocalhost = () => !!/^localhost:[0-9]+$/.test(location.host);

export const getDayName = (date, format = 'short') => date.toLocaleDateString(navigator.language, { weekday: format });
export const getDay = date => `${date.getFullYear()}-${date.toLocaleDateString(navigator.language, { month: '2-digit' })}-${date.toLocaleDateString(navigator.language, { day: '2-digit' })}`;
export const getDayWithHour = date => `${getDay(date)}T${date.toLocaleTimeString(navigator.language, { hour: '2-digit', hour12: false })}:00`;
export const getDate = date => date.toLocaleDateString(navigator.language, { month: 'numeric', day: 'numeric' });
export const getDateTime = date => date.toLocaleString(navigator.language, { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' });
export const getTime = date => date.toLocaleTimeString(navigator.language, { hour: 'numeric', minute: 'numeric' });
export const getHour = date => date.toLocaleTimeString(navigator.language, { hour: '2-digit' });
