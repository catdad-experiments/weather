export const fetchOk = async (url, ...args) => {
  const res = await fetch(url, ...args);

  if (!res.ok) {
    throw new Error(`failed to fetch "${url}": ${res.status} ${res.statusText}`);
  }

  return res;
};

export const isLocalhost = () => !!/^localhost:[0-9]+$/.test(location.host);