import { createContext, useContext, useEffect, html, useSignal } from '../preact.js';
import { getPosition } from '../sources/position.js';

const Location = createContext({});

export const withLocation = Component => ({ children, ...props }) => {
  const location = useSignal(null);

  useEffect(() => {
    getPosition().then(position => {
      console.log('got new location', position);
      location.value = { ...position };
    }).catch(err => {
      // TODO
      console.error('failed to get position:', err);
    });
  }, []);

  return html`
    <${Location.Provider} value=${{ location }}>
      <${Component} ...${props}>${children}<//>
    <//>
  `;
};

export const useLocation = () => useContext(Location);
