import { createSignal } from "./spicy/signal";

export const App = () => {
  const name = createSignal("Bob");

  return <div>Hello {name()}!</div>;
};
