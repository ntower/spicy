import "./style.css";
import { render } from "./spicy/render";
import { App } from "./App";

const element = document.querySelector<HTMLDivElement>("#app")!;

render(element, <App />);
