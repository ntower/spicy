export type IndependentSignal<T> = {
  (): T;
  (newValue: T): void;
};

export type DependantSignal<T> = {
  (): T;
};

// A temporary holding space used for linking up signals to eachother
const linkerStack: (() => void)[] = [];

// eslint-disable-next-line @typescript-eslint/ban-types
type NonFunction<T> = T extends Function ? never : T;

export function createSignal<T>(
  initialValue: NonFunction<T>
): IndependentSignal<T>;
export function createSignal<T>(initialValue: () => T): DependantSignal<T>;
export function createSignal<T>(
  initialValue: T | (() => T)
): IndependentSignal<T> | DependantSignal<T> {
  const isIndependent = typeof initialValue !== "function";
  let currentValue: T;
  // TODO: does this need to be a WeakSet to prevent leaks?
  const dependants: Set<() => unknown> = new Set();

  function getterAndSetter(): T;
  function getterAndSetter(newValue: T): void;
  function getterAndSetter(newValue?: T): T | void {
    if (newValue && isIndependent) {
      currentValue = newValue;
      for (const dependant of dependants.values()) {
        dependant();
      }
    } else {
      if (linkerStack.length > 0) {
        // Another signal is calculating its value, and it called us. We need to set
        //   them as a dependency so we can update them in the future.
        dependants.add(linkerStack[linkerStack.length - 1]);
      }
      return currentValue;
    }
  }

  if (typeof initialValue === "function") {
    const initializer = initialValue as () => T;

    const recompute = () => {
      /**
       * Dependencies may change from one call of the initializer to the next, eg:
       *
       *  () => {
       *   const a = someSignal();
       *   if (a > 1) {
       *     return a;
       *   } else {
       *     return someOtherSignal();
       *   }
       * }
       *
       * So we clear all the existing dependencies, then rerun the initializer. If
       * no dependencies changed, then they'll all be added back. If there are more
       * or less than before, we'll have all the new ones only.
       */
      dependants.clear();
      const index = linkerStack.length;
      // Add self to the stack so other signals can find us
      linkerStack[index] = recompute;
      currentValue = initializer();
      linkerStack.length = index;
    };

    recompute();
  } else {
    currentValue = initialValue as T;
  }

  return getterAndSetter;
}
