import Block from "../../../core/block";
import Input from "./input";

type InputFieldProps = {
  label?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
  onKeyDown?: (e: Event) => void;
  name?: string;
  htmlType?: string;
  colorTheme?: string;
  error?: string;
  value?: string;
};

export default class InputField extends Block {
  constructor(props: InputFieldProps) {
    super("div", {
      ...props,
      className: "input",
      Input: new Input({
        className: `input__element`,
        name: props.name,
        htmlType: props.htmlType,
        value: props.value, // пробрасываем value
        events: {
          change: props.onChange,
          blur: props.onBlur,
          keydown: props.onKeyDown, // пробрасываем onKeyDown
        },
      }),
    });
  }

  public componentDidUpdate(oldProps: InputFieldProps, newProps: InputFieldProps): boolean {
    if (oldProps.value !== newProps.value) {
      (this.children.Input as Block).setProps({ value: newProps.value });
    }
    return true;
  }

  public render(): string {
    return `
      <label class="input__container">
        <span class="input__label {{ colorTheme }}">{{ label }}</span>
        {{{ Input }}}
      </label>
      <div class="input__error">{{#if error}}{{error}}{{/if}}</div>
    `;
  }
}
