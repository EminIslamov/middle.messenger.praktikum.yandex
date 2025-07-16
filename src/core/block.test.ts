import { expect } from "chai";
import Block, { PropsBlock } from "./block.js";

class TestBlock extends Block {
  constructor(props: PropsBlock) {
    super("div", props);
  }

  render(): string {
    return `
      <div class="test-block">
        <h1>{{title}}</h1>
        <p>{{description}}</p>
        {{#if showButton}}
          <button>{{buttonText}}</button>
        {{/if}}
        {{{childComponent}}}
      </div>
    `;
  }

  getProps() {
    return this.props;
  }

  getChildren() {
    return this.children;
  }
}

class ChildComponent extends Block {
  constructor(props: PropsBlock) {
    super("span", props);
  }

  render(): string {
    return `<span class="child">{{text}}</span>`;
  }
}

describe("Block (Template Engine)", () => {
  let testBlock: TestBlock;

  beforeEach(() => {
    testBlock = new TestBlock({
      title: "Test Title",
      description: "Test Description",
      showButton: true,
      buttonText: "Click me",
      childComponent: new ChildComponent({ text: "Child Text" }),
    });
  });

  describe("Core Functionality", () => {
    it("should create block with correct props", () => {
      const props = testBlock.getProps();
      expect(props.title).to.equal("Test Title");
      expect(props.description).to.equal("Test Description");
    });

    it("should generate unique id for each block", () => {
      const block1 = new TestBlock({});
      const block2 = new TestBlock({});
      expect(block1.id).to.not.equal(block2.id);
    });

    it("should compile template with variables", () => {
      const content = testBlock.getContent();
      expect(content.innerHTML).to.include("Test Title");
      expect(content.innerHTML).to.include("Test Description");
    });

    it("should handle conditional rendering", () => {
      const blockWithButton = new TestBlock({
        title: "Test",
        showButton: true,
        buttonText: "Click me",
      });

      const blockWithoutButton = new TestBlock({
        title: "Test",
        showButton: false,
        buttonText: "Click me",
      });

      const contentWithButton = blockWithButton.getContent();
      const contentWithoutButton = blockWithoutButton.getContent();

      expect(contentWithButton.innerHTML).to.include("<button>");
      expect(contentWithoutButton.innerHTML).to.not.include("<button>");
    });

    it("should render child components", () => {
      const content = testBlock.getContent();
      expect(content.innerHTML).to.include("Child Text");
    });
  });

  describe("Props Management", () => {
    it("should update props and re-render", () => {
      const initialContent = testBlock.getContent();
      expect(initialContent.innerHTML).to.include("Test Title");

      testBlock.setProps({ title: "Updated Title" });
      const updatedContent = testBlock.getContent();
      expect(updatedContent.innerHTML).to.include("Updated Title");
    });
  });

  describe("Event Handling", () => {
    it("should add event listeners", () => {
      let clicked = false;
      const block = new TestBlock({
        title: "Test",
        events: {
          click: () => {
            clicked = true;
          },
        },
      });

      const element = block.getContent();
      element.click();
      expect(clicked).to.equal(true);
    });
  });

  describe("Element Management", () => {
    it("should show and hide elements", () => {
      const element = testBlock.getContent();

      testBlock.hide();
      expect(element.style.display).to.equal("none");

      testBlock.show();
      expect(element.style.display).to.equal("block");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty template", () => {
      class EmptyBlock extends Block {
        render(): string {
          return "";
        }
      }

      const block = new EmptyBlock("div", {});
      const content = block.getContent();
      expect(content.innerHTML).to.equal("");
    });

    it("should handle template with only text", () => {
      class TextBlock extends Block {
        render(): string {
          return "Just text content";
        }
      }

      const block = new TextBlock("div", {});
      const content = block.getContent();
      expect(content.innerHTML).to.equal("Just text content");
    });
  });
});
