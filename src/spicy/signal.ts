type Initializer<T> = T extends any ? T | (() => T) : never;

export const createSignal = <T>(initialValue: Initializer<T>) => {
  let currentValue: T;
  if (typeof initialValue === "function") {
    // TODO: somehow track if any signals are used during initialValue. If so,
    //   add them to a dependency tree
    currentValue = initialValue();
  } else {
    currentValue = initialValue as T;
  }

  function getterAndSetter(): T;
  function getterAndSetter(newValue: T): void;
  function getterAndSetter(newValue?: T): T | void {
    if (newValue) {
      currentValue = newValue;
      // TODO: trigger other signals
    } else {
      return currentValue;
    }
  }
  return getterAndSetter;
};
