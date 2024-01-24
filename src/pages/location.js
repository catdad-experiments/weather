import { html, useSignal, batch } from '../preact.js';
import { useLocation } from '../hooks/location.js';
import { useStyle } from '../hooks/style.js';
import { useRoutes } from '../hooks/routes.js';
import { geocode } from '../sources/geocode.js';

import { Scaffold } from '../ui/scaffold.js';
import { Button } from '../ui/button.js';
import { LocationDetails, LocationChip } from "../ui/current-location.js";
import { Emoji } from '../ui/emoji.js';

// https://dev.to/jorik/country-code-to-flag-emoji-a21
function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const UseDeviceLocation = () => {
  const { history, useDeviceLocation } = useLocation();
  const { route, ROUTES } = useRoutes();

  const deviceLocation = history.value.find(a => a.type === 'device');

  const classname = useStyle(`
    $ {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    $ button {
      display: block;
    }
  `);

  return html`<div class="${classname}">
    ${deviceLocation ? html`<${LocationDetails} location=${deviceLocation} />` : null}
    <${Button} onClick=${() => {
      useDeviceLocation().then(() => {
        route.value = ROUTES.forecast;
      }).catch(err => {
        console.log('failed to use device location on user request:', err);
      });
    }}>Use device location<//>
  <//>`;
};

const SearchResults = ({ results }) => {
  const { setLocation } = useLocation();
  const { route, ROUTES } = useRoutes();

  const classname = useStyle(`
    $ {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    $ .result {
      display: grid;
      grid-template-columns: max-content auto;
      gap: 1rem 1rem;
      padding: 1rem;
      width: 100%;
    }

    $ .result:nth-child(even) {
      background: rgba(255,255,255,0.1);
      border-radius: 5px;
    }

    $ .description {
      text-align: center;
    }
  `);

  return html`<div class="${classname} limit">
    ${(() => {
      if (!results) {
        return html`<div>Type a city name to search<//>`;
      }

      if (results.length === 0) {
        return html`<div>No results found<//>`;
      }

      return results.map(place => html`<div key="${place.description}" class="result" onClick=${() => {
        batch(() => {
          setLocation({
            latitude: place.latitude,
            longitude: place.longitude,
            description: `${place.name}, ${place.description}`
          });
          route.value = ROUTES.forecast;
        });
      }}>
        <${Emoji}>${getFlagEmoji(place.countryCode)}<//>
        <span class="description">${place.name}, ${place.description}<//>
      <//>`);
    })()}
  <//>`;
};

export const Location = () => {
  const searchResults = useSignal(null);

  const onInputChange = ({ value }) => {
    if (value === '') {
      searchResults.value = null;
      return;
    }

    geocode(value).then(results => {
      console.log(`📍 "${value}" lookup:`, results);
      searchResults.value = results;
    }).catch(err => {
      console.log(`failed to geocode "${value}":`, err);
    });
  };

  return html`<${Scaffold}
    header=${html`<${LocationChip} editable autofocus onChange=${onInputChange} />`}
  >
    <${UseDeviceLocation} />
    <${SearchResults} results=${searchResults.value} />
  <//>`;
};
