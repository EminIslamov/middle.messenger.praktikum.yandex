import Block from "../../../core/block";

type InputProps = {
  className: string;
  label?: string;
  htmlType?: string;
  name?: string;
  value?: string;
  events?: {
    change?: EventListener;
    blur?: EventListener;
    keydown?: EventListener;
  };
};

export default class Input extends Block {
  constructor(props: InputProps) {
    super("input", {
      ...props,
      attrs: {
        type: props.htmlType || "text",
        name: props.name || "",
        value: props.value || "",
      },
      events: props.events,
    });
  }

  public setValue(value: string) {
    const input = this.element as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  public componentDidUpdate(oldProps: InputProps, newProps: InputProps): boolean {
    if (oldProps.value !== newProps.value) {
      this.setValue(newProps.value || "");
    }
    return true;
  }
}
