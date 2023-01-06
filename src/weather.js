import { createContext, useContext, useEffect, html, signal, useSignal } from './preact.js';

const Weather = createContext({});

export const withWeather = Component => ({ children, ...props }) => {
  const coords = useSignal(null);
  const weather = useSignal(null);

  useEffect(() => {
    // note: look into using watchPosition()
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      coords.value = { latitude, longitude };
    }, err => {
      console.log('failed to get position:', err);
    });
  }, [coords]);

  return html`
    <${Weather.Provider} value=${{ coords, weather }}>
      <${Component} ...${props}>${children}<//>
    <//>
  `;
};

export const useWeather = () => useContext(Weather);
