import Block from "../../../core/block";

interface ActionMenuProps extends Record<string, unknown> {
  isOpen: boolean;
  content: Block;
  onClose?: () => void;
}

export default class ActionMenu extends Block<ActionMenuProps> {
  constructor(props: ActionMenuProps) {
    super("div", {
      ...props,
      events: {
        click: (e: Event) => {
          e.stopPropagation();
        }
      }
    });

    document.addEventListener('click', this._handleOutsideClick.bind(this));
  }

  private _handleOutsideClick(e: Event) {
    const target = e.target as HTMLElement;
    if (this.props.isOpen && !this.element?.contains(target)) {
      this.props.onClose?.();
    }
  }

  protected componentWillUnmount(): boolean {
    document.removeEventListener('click', this._handleOutsideClick.bind(this));
    return true;
  }

  render() {
    return `
      <div class="action-menu-wrapper">
        <div class="action-menu {{#if isOpen}}action-menu--open{{/if}}">
          {{{ content }}}
        </div>
      </div>
    `;
  }
}
