import { createSignal } from "./signal";
describe("Signal", () => {
  describe("Independent signals", () => {
    test("should set initial value", () => {
      const value = createSignal(1);
      expect(value()).toEqual(1);
    });
    test("should set new value", () => {
      const value = createSignal(1);
      value(2);
      expect(value()).toEqual(2);
    });
  });

  describe("Dependant signals", () => {
    test("should set initial value", () => {
      const value = createSignal(1);
      const value2 = createSignal(() => value() + 1);
      expect(value2()).toEqual(2);
    });

    test("should only function as a getter", () => {
      const value = createSignal(1);
      const value2 = createSignal(() => value() + 1);
      //@ts-expect-error - the types correctly show it's an error to pass in 100.
      //   This test is for if someone ignores the type error (or isn't using TS)
      const result = value2(100);
      expect(result).toEqual(2);
      expect(value2()).toEqual(2);
    });

    test("should set new value when parent is changed", () => {
      const value = createSignal(1);
      const value2 = createSignal(() => value() + 1);
      value(2);
      expect(value2()).toEqual(3);
    });

    test("multiple calls to value() should only require a single update", () => {
      const value = createSignal(1);
      let callCount = 0;
      const value2 = createSignal(() => {
        callCount++;
        // We want signal to be smart enough to realize that it only needs to
        //    update once, even though we're calling value() twice.
        return value() + value();
      });
      value(2);

      expect(callCount).toEqual(2);
      expect(value2()).toEqual(4);
    });

    test("should support changing dependencies", () => {
      const value = createSignal(1);
      const otherValue = createSignal(100);
      const computedValue = createSignal(() => {
        const a = value();
        if (a < 10) {
          return a + 1;
        } else {
          return otherValue();
        }
      });
      expect(computedValue()).toEqual(2);
      value(10);
      // At this point, we're now dependant on otherValue, even though
      //    we weren't initially.
      expect(computedValue()).toEqual(100);
      otherValue(200);
      expect(computedValue()).toEqual(200);
    });
  });
});
