import { SpicyElement } from "./createElement";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const render = (domElement: Element, spicyElement: SpicyElement) => {
  const element = document.createElement(spicyElement.type);
  const children = spicyElement.props.children;
  if (typeof children === "string") {
    element.textContent = children;
  }
  domElement.appendChild(element);
};
