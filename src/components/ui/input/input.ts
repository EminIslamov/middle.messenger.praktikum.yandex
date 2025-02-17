import Block from "../../../core/block";

type InputProps = {
    className: string;
    label?: string;
    htmlType?: string;
    name?: string;
    events?: {
        change?: (e: Event) => void;
        blur?: (e: Event) => void;
    };
};

export default class Input extends Block {
    constructor(props: InputProps) {
        super("input", {
            ...props,
            attrs: {
                type: props.htmlType || "text",
                name: props.name || "",
            },
        });
    }
}