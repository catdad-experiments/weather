import { html } from '../preact.js';
import { useStyle } from '../hooks/style.js';

export const Scaffold = ({
  class: inputClassname,
  children,
  header,
  footer = html`<div class="center"><a href="https://open-meteo.com/">Weather data by Open-Meteo.com</a><//>`
}) => {
  const classname = useStyle(`
    $ {
      display: flex;
      flex-direction: column;
      min-width: 100%;
      min-height: 100vh;
    }

    $ .header {
      flex-grow: 0;
    }

    $ .content {
      flex-grow: 1;
    }

    $ .footer {
      flex-grow: 0;
      padding-bottom: calc(var(--spacing));
    }
  `);

  return html`<div class="${classname} ${inputClassname}">
    <div class="header">${header}<//>
    <div class="content">${children}<//>
    <div class="footer">${footer}<//>
  <//>`;
};
