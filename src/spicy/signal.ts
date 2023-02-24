type Linker = (unsubscribe: () => void) => () => unknown;

const linkerStack: Linker[] = [];

// TODO: how to teardown signals? Make sure they aren't perpetual memory leaks.

export const createSignal = <T>(initialValue: T | (() => T)) => {
  let currentValue: T;
  const dependants: Set<() => unknown> = new Set();

  function getterAndSetter(): T;
  function getterAndSetter(newValue: T): void;
  function getterAndSetter(newValue?: T): T | void {
    if (newValue) {
      currentValue = newValue;
      console.log("notifying", dependants.size, "dependants");
      // TODO: do i need to clone the set before iterating? Not sure if `.values()` is a live view.
      for (const dependant of dependants.values()) {
        dependant();
      }
    } else {
      if (linkerStack.length > 0) {
        // Another signal is initializing and it called us. We need to set it as a
        //   dependency so we can update it in the future.
        const linker = linkerStack[linkerStack.length - 1];
        const unsubscribe = () => dependants.delete(dependant);
        const dependant = linker(unsubscribe);
        dependants.add(dependant);
      }
      return currentValue;
    }
  }

  if (typeof initialValue === "function") {
    console.log(">>> initializing with function");
    const index = linkerStack.length;
    const initializer = initialValue as () => T;

    const recompute = () => {
      console.log(">>> recompute called");
      /**
       * TODO: handle changing dependencies when recomputing. For example, consider an
       * initializer like this:
       *
       * () => {
       *   const a = someSignal();
       *   if (a > 1) {
       *     return a;
       *   } else {
       *     return someOtherSignal();
       *   }
       * }
       *
       * We might need to add or remove a dependency.
       */
      currentValue = initializer();
    };

    const linker = (unsubscribe: () => void) => {
      // TODO: save the unsubscribe function so we can call it if we later remove this dependency.
      return recompute;
    };

    // Push self onto the stack so nested signals can find us
    linkerStack[index] = linker;
    currentValue = initializer();
    linkerStack.length = index;
  } else {
    currentValue = initialValue as T;
  }

  return getterAndSetter;
};
