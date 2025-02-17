import Block from "../../../core/block";
import Input from "./input";

type InputFieldProps = {
  label?: string;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
  name?: string;
  htmlType?: string;
  colorTheme?: string;
};

export default class InputField extends Block {
  constructor(props: InputFieldProps) {
    super("div", {
      ...props,
      className: "input",
      change: props.onChange,
      blur: props.onBlur,
      name: props.name,
      colorTheme: props.colorTheme,
      Input: new Input({
        className: `input__element`,
        name: props.name,
        htmlType: props.htmlType,
        events: {
          change: props.onChange,
          blur: props.onBlur,
        },
      }),
    });
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
