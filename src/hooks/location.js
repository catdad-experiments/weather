import { createContext, useContext, useEffect, html, useSignal, batch } from '../preact.js';
import { getPosition } from '../sources/position.js';
import { useRoutes } from './routes.js';

const Location = createContext({});

export const withLocation = Component => ({ children, ...props }) => {
  const location = useSignal(null);
  const history = useSignal([]);
  const { route, ROUTES } = useRoutes();

  const useDeviceLocation = async () => {
    const position = await getPosition();
    console.log('got new location', position);
    setLocation({
      ...position,
      type: 'device'
    });
  };

  const setLocation = ({ latitude, longitude, description, type = 'manual' }) => {
    batch(() => {
      const value = {
        latitude,
        longitude,
        description,
        type
      };

      location.value = { ...value };
      history.value = [...history.value, { ...value }];
    });
  };

  useEffect(() => {
    (async () => {
      const { state: geolocationPermission } = await navigator.permissions.query({ name: 'geolocation' });

      if (geolocationPermission === 'granted') {
        await useDeviceLocation();
      } else {
        route.value = ROUTES.location;
      }
    })().catch(err => {
      // TODO
      console.error('failed to get position:', err);
      route.value = ROUTES.location;
    });
  }, []);

  if (!location.value && route.value !== ROUTES.location) {
    return html`<div>Getting location...<//>`;
  }

  return html`
    <${Location.Provider} value=${{ location, history, useDeviceLocation, setLocation }}>
      <${Component} ...${props}>${children}<//>
    <//>
  `;
};

export const useLocation = () => useContext(Location);
