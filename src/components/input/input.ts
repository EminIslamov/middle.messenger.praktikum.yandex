import Block from "../../core/block";

type InputProps = {
    className: string;
    label?: string;
    htmlType?: string;
    name?: string;
    events?: {
        change?: (e: Event) => void;
        blur?: (e: FocusEvent) => void;
    };
};

export default class Input extends Block {
    constructor(props: InputProps) {
        super("input", {
            ...props,
            attrs: {
                type: props.htmlType,
                name: props.name,
            },
        });
    }
}