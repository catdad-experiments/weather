import { html } from "../preact.js";

// see https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/
const fonts = [
  "Twemoji Mozilla",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
  "Noto Color Emoji",
  "EmojiOne Color",
  "Android Emoji",
  'system emoji',
  'sans-serif'
].map(a => `"${a}"`).join(',');

export const Emoji = ({ children, style, ...props }) => {
  return html`<span ...${props} style="${style}; font-family: ${fonts}">${children}<//>`;
};

export const useEmojiFont = () => fonts;
