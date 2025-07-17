import { expect } from "chai";
import Handlebars from "handlebars";
import Block, { PropsBlock } from "./block.js";
import registerComponent from "./registerComponents.js";

class TestComponent extends Block {
  constructor(props: PropsBlock) {
    super("div", props);
  }

  render(): string {
    return `<div class="test-component">{{text}}</div>`;
  }
}

describe("registerComponent", () => {
  beforeEach(() => {
    Handlebars.unregisterHelper("TestComponent");
  });

  describe("Component Registration", () => {
    it("should register component as Handlebars helper", () => {
      registerComponent(TestComponent);

      const template = Handlebars.compile('{{{TestComponent text="Hello"}}}');
      const result = template({});

      expect(result).to.include("data-id");
    });

    it("should create component with passed props", () => {
      registerComponent(TestComponent);

      const template = Handlebars.compile(
        '{{{TestComponent text="Custom Text"}}}',
      );
      const result = template({});

      expect(result).to.include("data-id");
    });

    it("should handle component without props", () => {
      registerComponent(TestComponent);

      const template = Handlebars.compile("{{{TestComponent}}}");
      const result = template({});

      expect(result).to.include("data-id");
    });
  });
});
