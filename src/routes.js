import { createContext, useContext, html, useSignal } from './preact.js';

const Routes = createContext({});

export const withRoutes = Component => ({ children, ...props }) => {
  const route = useSignal('forecast');
  const routeData = useSignal(null);

  return html`
    <${Routes.Provider} value=${{ route, routeData }}>
      <${Component} ...${props}>${children}<//>
    <//>
  `;
};

export const useRoutes = () => useContext(Routes);
