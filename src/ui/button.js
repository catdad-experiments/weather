import { html } from "../preact.js";
import { useStyle } from "../hooks/style.js";

export const Button = ({ children, ...props }) => {
  const classname = useStyle(`
    $ {
      padding: 0.5rem 1rem;
      border: none;
      background: var(--middle);
      border-radius: 3px;
    }
  `);

  return html`<button ...${props} class="${classname}">${children}<//>`;
};
