import Block from "../../core/block";

export default class Button extends Block {
    constructor(props) {
        super("button", {
            ...props,
            className: `button button__${props.type} ${props.colorTheme}`,
            page: props.page,
            colorTheme: props.colorTheme,
            events: {
                click: props.onClick,
            },
        });
    }
    public render(): string {
        return `
          {{ label }}
    `;
    }
}