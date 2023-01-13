import { useSignal, useComputed, useEffect } from "./preact.js";

const random = () => `x${Math.random().toString(36).slice(2)}`;

export const useStyle = (styleStr) => {
  const parentClass = useSignal(random());
  const value = useSignal(styleStr);

  const scopedStyle = useComputed(() => {
    const parent = `.${parentClass.value}`;
    const text = value.value.replace(/\$/g, parent);

    const doc = document.implementation.createHTMLDocument('');
    const styleElement = document.createElement('style');

    styleElement.textContent = text;
    // the style will only be parsed once it is added to a document
    doc.body.appendChild(styleElement);

    const rules = styleElement.sheet.cssRules;

    return [...rules]
      // this tries to scope all rules, but fails with media queries
      // .map(rule => rule.cssText.indexOf(parent) === 0 ? rule.cssText : `${parent} ${rule.cssText}`)
      .map(rule => rule.cssText)
      .join('\n');
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = scopedStyle.value;

    document.body.appendChild(style);

    return () => {
      style.remove();
    };
  }, [scopedStyle.value]);

  return parentClass;
};
