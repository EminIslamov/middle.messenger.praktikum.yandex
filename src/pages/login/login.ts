import { Button, Input } from "../../components";
import Block from "../../core/block";
import { validateLogin, validatePassword } from "../../utils/validate.ts";
import { Router } from "../../core/router.ts";
import { AuthController } from "../../controllers/AuthController.ts";

const router = new Router("#app");

export default class LoginPage extends Block {
  constructor() {
    super("div", {
      // ...props,
      className: "container",
      formState: {
        login: "",
        password: "",
      },
      errors: {
        login: "",
        password: "",
      },
      InputLogin: new Input({
        label: "Введите логин",
        name: "login",
        onBlur: () => {
          const value = this.props.formState?.login as string;
          if (value !== undefined) {
            const error = validateLogin(value);
            if (error) {
              (this.children.InputLogin as Block).setProps({ error });
            }
          }
        },
        onChange: (e: Event) => {
          (this.children.InputLogin as Block).setProps({ error: "" });
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({
            formState: {
              ...(this.props.formState as { login: string; password: string }),
              login: value,
            },
          });
        },
      }),
      InputPassword: new Input({
        label: "Введите Пароль",
        name: "password",
        onBlur: () => {
          const value = this.props.formState?.password as string;
          if (value !== undefined) {
            const error = validatePassword(value);
            if (error) {
              (this.children.InputPassword as Block).setProps({ error });
            }
          }
        },
        onChange: (e: Event) => {
          (this.children.InputPassword as Block).setProps({ error: "" });
          const target = e.target as HTMLInputElement;
          const value = target.value;
          this.setProps({
            formState: {
              ...(this.props.formState as { login: string; password: string }),
              password: value,
            },
          });
        },
      }),
      SignInButton: new Button({
        label: "Войти",
        type: "primary",
        page: "signup",
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.preventDefault();
          const validators = [
            { field: "login", validate: validateLogin, input: "InputLogin" },
            {
              field: "password",
              validate: validatePassword,
              input: "InputPassword",
            },
          ];
          let isValid = true;
          validators.forEach(({ field, validate, input }) => {
            const value = this.props.formState?.[field] as string;
            if (value !== undefined) {
              const error = validate(value);
              if (error) {
                (this.children[input] as Block).setProps({ error });
                isValid = false;
              } else {
                (this.children[input] as Block).setProps({ error: "" });
              }
            }
          });
          if (isValid) {
            AuthController.login(this.props.formState as {login: string, password: string}, router);

          }
        },
      }),
      SignUpButton: new Button({
        label: "Перейти к регистрации",
        type: "link",
        page: "signup",
        colorTheme: "dark-theme",
        onClick: (e: Event) => {
          e.preventDefault();
          router.go("/sign-up");
        },
      }),
    });
  }

  public render(): string {
    return `
      <form class="login-form">
        <div class="inputs-wrapper">
          {{{ InputLogin }}}
          {{{ InputPassword }}}
        </div>

        <div class="btns-wrapper">
          {{{ SignInButton }}}
          {{{ SignUpButton }}}
        </div>
    </form>
    `;
  }
}
