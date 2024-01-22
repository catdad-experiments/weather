import { html } from '../preact.js';
import { useLocation } from '../hooks/location.js';
import { useStyle } from '../hooks/style.js';
import { useRoutes } from '../hooks/routes.js';

import { CurrentLocation, LocationChip } from "../ui/current-location.js";

export const UseDeviceLocation = () => {
  const { location, useDeviceLocation } = useLocation();
  const { route, ROUTES } = useRoutes();

  const button = html`<button onClick=${() => {
    useDeviceLocation().then(() => {
      route.value = ROUTES.forecast;
    }).catch(err => {
      console.log('failed to use device location on user request:', err);
    });
  }}>Use device location</button>`;

  if (!location.value) {
    return button;
  }

  return html`<div>
    <${CurrentLocation} />
    ${button}
  <//>`;
};

export const Location = () => {

  const classname = useStyle(`
    $ {

    }
  `);

  const onInputChange = ({ value }) => {
    console.log('new location value input:', value);
  };

  return html`<div class="${classname} limit">
    <${LocationChip} editable onChange=${onInputChange} />
    <${UseDeviceLocation} />
  <//>`;
};
