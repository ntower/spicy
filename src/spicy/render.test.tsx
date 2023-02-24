import { h } from "./createElement";
import { render } from "./render";

describe("Render", () => {
  describe("Native components", () => {
    test("should put a div on the dom", () => {
      const root = document.getElementsByTagName("body")[0];
      render(root, h("div", { children: "hello world" }));
      expect(root.children.length).toEqual(1);
      expect(root.children[0].tagName).toEqual("DIV");
      expect(root.children[0].textContent).toEqual("hello world");
    });

    // test("should put a div on the dom, JSX", () => {
    //   const root = document.getElementsByTagName("body")[0];
    //   render(root, <div>hello world</div>);
    //   expect(root.children.length).toEqual(1);
    //   expect(root.children[0].tagName).toEqual("DIV");
    //   expect(root.children[0].textContent).toEqual("hello world");
    // });
  });

  // describe("Custom components", () => {
  //   test("should put the contents of the component on the dom", () => {

  //   });
  // });
});
