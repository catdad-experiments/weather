import { createContext, useContext, html, useSignal } from '../preact.js';

const Routes = createContext({});

const ROUTES = Object.freeze({
  forecast: 'forecast',
  location: 'location'
});

export const withRoutes = Component => ({ children, ...props }) => {
  const route = useSignal(ROUTES.forecast);
  const routeData = useSignal(null);

  return html`
    <${Routes.Provider} value=${{ route, routeData, ROUTES }}>
      <${Component} ...${props}>${children}<//>
    <//>
  `;
};

export const useRoutes = () => useContext(Routes);
