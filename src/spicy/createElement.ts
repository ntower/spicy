export interface SpicyElement {
  type: string;
  props: Record<string, unknown>;
}

// TODO: give this a better name. I just went with h because the tutorials for custom JSX used h.
// TODO: type needs to be one of the valid dom nodes, not any string. Or custom components when i support that.
export const h = (
  type: string,
  props?: Record<string, unknown>
): SpicyElement => {
  return { type, props: props || {} };
};
