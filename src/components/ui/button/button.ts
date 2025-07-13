import Block from "../../../core/block";

export interface ButtonProps {
  type: string;
  colorTheme: string;
  page?: string;
  onClick?: EventListener;
  label: string;
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super("button", {
      ...props,
      className: `button button__${props.type} ${props.colorTheme}`,
      page: props.page,
      colorTheme: props.colorTheme,
      events: {
        click: props.onClick || (() => {}),
      },
    });
  }
  public render(): string {
    return `
          {{{ label }}}
    `;
  }
}
