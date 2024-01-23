import { html, useSignal, batch } from '../preact.js';
import { useLocation } from '../hooks/location.js';
import { useStyle } from '../hooks/style.js';
import { useRoutes } from '../hooks/routes.js';
import { geocode } from '../sources/geocode.js';

import { Button } from '../ui/button.js';
import { CurrentLocation, LocationChip } from "../ui/current-location.js";

const UseDeviceLocation = () => {
  const { location, useDeviceLocation } = useLocation();
  const { route, ROUTES } = useRoutes();

  const classname = useStyle(`
    $ {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  `);

  const button = html`<${Button} onClick=${() => {
    useDeviceLocation().then(() => {
      route.value = ROUTES.forecast;
    }).catch(err => {
      console.log('failed to use device location on user request:', err);
    });
  }}>Use device location<//>`;

  if (!location.value) {
    return button;
  }

  return html`<div class="${classname}">
    <${CurrentLocation} />
    ${button}
  <//>`;
};

const SearchResults = ({ results }) => {
  const { setLocation } = useLocation();
  const { route, ROUTES } = useRoutes();

  if (!results) {
    return html`<div>Type a city name to search<//>`;
  }

  if (results.length === 0) {
    return html`<div>No results found.<//>`;
  }

  return results.map(place => html`<div id="${place.description}" onClick=${() => {
    batch(() => {
      setLocation({
        latitude: place.latitude,
        longitude: place.longitude,
        description: `${place.name}, ${place.description}`
      });
      route.value = ROUTES.forecast;
    });
  }}>
    ${place.name}, ${place.description}
  <//>`);
};

export const Location = () => {
  const searchResults = useSignal(null);

  const classname = useStyle(`
    $ {

    }
  `);

  const onInputChange = ({ value }) => {
    geocode(value).then(results => {
      console.log(`📍 "${value}" lookup:`, results);
      searchResults.value = results;
    }).catch(err => {
      console.log(`failed to geocode "${value}":`, err);
    });
  };

  return html`<div class="${classname} limit">
    <${LocationChip} editable onChange=${onInputChange} />
    <${UseDeviceLocation} />
    <${SearchResults} results=${searchResults.value} />
  <//>`;
};
