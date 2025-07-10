import Block from "../../../core/block.ts";

export default class ChatCreateModalContent extends Block {
  constructor(props: { children: { ChatTitleInput: Block; } }) {
    super("div", {
      className: "modal__form",
      ...props.children
    });
  }

  render() {

    return `
      <div class="modal__input">
        {{{ ChatTitleInput }}}
      </div>
    `;
  }
}
