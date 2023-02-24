import { SpicyElement } from "./createElement";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const render = (domElement: Element, spicyElement: SpicyElement) => {
  const element = document.createElement(spicyElement.type);
  console.log("new element", element);
  const children = spicyElement.props.children;
  if (typeof children === "string") {
    element.textContent = children;
  }
  domElement.appendChild(element);
  console.log("appended", domElement.children.length);
};
