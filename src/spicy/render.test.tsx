import { h } from "./createElement";
import { render } from "./render";

describe("Render", () => {
  test("should put a div on the dom", () => {
    const root = document.getElementsByTagName("body")[0];
    render(root, h("div", { children: "hello world" }));
    expect(root.children.length).toEqual(1);
    expect(root.children[0].tagName).toEqual("DIV");
    expect(root.children[0].textContent).toEqual("hello world");
  });
});
