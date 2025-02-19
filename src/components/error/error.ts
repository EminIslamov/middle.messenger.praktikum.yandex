import Block from "../../core/block.ts";
import { Button } from "../ui/button";

type ErrorProps = {
  errorCode: string;
  errorMessage: string;
};

export class Error extends Block {
  constructor(props: ErrorProps) {
    super("div", {
      errorCode: props.errorCode,
      ExitButton: new Button({
        label: "Выйти",
        type: "link",
        colorTheme: "light-theme",
        // onClick: () => { /* your click handler logic */ },
        // page: "login",
      }),
    });
  }

  public render(): string {
    return `
        <div class="error_wrapper">
            <h1 class="error__code">
                {{ errorCode }}
            </h1>
    
            <div class="error__message">
                {{ errorMessage }}
            </div>
            <div class="error_btn_wrapper">
            {{{ }}}
                {{{ ExitButton }}}
            </div>
        </div>
        `;
  }
}
