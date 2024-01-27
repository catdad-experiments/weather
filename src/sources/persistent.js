export const persistent = ((key) => {
  const data = (() => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null
    }
  })() || {};

  const set = (name, value) => {
    data[name] = value;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const get = (name) => {
    return structuredClone(data[name]);
  };

  return { get, set };
})('weather');
