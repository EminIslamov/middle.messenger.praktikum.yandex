import Block from "../../core/block.ts";
import { Button, Input } from "../../components";
import {
  validateEmail,
  validateFirstName,
  validateLogin,
  validatePassword,
  validatePhone,
  validateSecondName,
} from "../../utils/validate.ts";

export default class SignUpPage extends Block {
  constructor() {
    super("div", {
      className: "container",
      email: "leocherep@mail.ru",
      first_name: "Леонардо",
      login: "turtle",
      formState: {
        email: "",
        login: "",
        first_name: "",
        second_name: "",
        display_name: "",
        phone: "",
        password: "",
      },

      InputEmail: new Input({
        label: "Введите почту",
        name: "email",

        onBlur: () => {
          const value = this.props.formState?.email as string;
          if (value !== undefined) {
            const error = validateEmail(value);
            if (error) {
              (this.children.InputEmail as Block).setProps({ error });
            }
          }
        },
        onChange: (e: Event) => {
          (this.children.InputEmail as Block).setProps({
            error: "",
          });

          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.setProps({
            formState: {
              ...this.props.formState,
              email: value,
            },
          });
        },
      }),

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
          (this.children.InputLogin as Block).setProps({
            error: "",
          });

          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.setProps({
            formState: {
              ...this.props.formState,
              login: value,
            },
          });
        },
      }),

      InputFirsName: new Input({
        label: "Введите имя",
        name: "first_name",
        onBlur: () => {
          const value = this.props.formState?.first_name as string;
          if (value !== undefined) {
            const error = validateFirstName(value);
            if (error) {
              (this.children.InputFirsName as Block).setProps({ error });
            }
          }
        },
        onChange: (e: Event) => {
          (this.children.InputFirsName as Block).setProps({
            error: "",
          });

          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.setProps({
            formState: {
              ...this.props.formState,
              first_name: value,
            },
          });
        },
      }),

      InputSecondName: new Input({
        label: "Введите фамилию",
        name: "second_name",
        onBlur: () => {
          const value = this.props.formState?.second_name as string;
          if (value !== undefined) {
            const error = validateSecondName(value);
            if (error) {
              (this.children.InputSecondName as Block).setProps({ error });
            }
          }
        },
        onChange: (e: Event) => {
          console.log("onChange triggered");

          (this.children.InputSecondName as Block).setProps({
            error: "",
          });

          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.setProps({
            formState: {
              ...this.props.formState,
              second_name: value,
            },
          });
        },
      }),

      InputPhone: new Input({
        label: "Введите номер телефона",
        name: "phone",

        onBlur: () => {
          const value = this.props.formState?.phone as string;
          if (value !== undefined) {
            const error = validatePhone(value);
            if (error) {
              (this.children.InputPhone as Block).setProps({ error });
            }
          }
        },
        onChange: (e: Event) => {
          (this.children.InputPhone as Block).setProps({
            error: "",
          });

          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.setProps({
            formState: {
              ...this.props.formState,
              phone: value,
            },
          });
        },
      }),

      InputPassword: new Input({
        label: "Введите пароль",
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
          (this.children.InputPassword as Block).setProps({
            error: "",
          });

          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.setProps({
            formState: {
              ...this.props.formState,
              password: value,
            },
          });
        },
      }),

      SignUpButton: new Button({
        label: "Зарегистрироваться",
        type: "primary",
        page: "signup",
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.preventDefault();
          const validators = [
            { field: "email", validate: validateEmail, input: "InputEmail" },
            { field: "login", validate: validateLogin, input: "InputLogin" },
            {
              field: "first_name",
              validate: validateFirstName,
              input: "InputFirsName",
            },
            {
              field: "second_name",
              validate: validateSecondName,
              input: "InputSecondName",
            },
            { field: "phone", validate: validatePhone, input: "InputPhone" },
            {
              field: "password",
              validate: validatePassword,
              input: "InputPassword",
            },
          ];

          let isValid = true;

          // Пробегаем по всем полям и валидаторам
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
            console.log(this.props.formState);
          }
        },
      }),
      ExitButton: new Button({
        label: "Перейти к авторизации",
        type: "link",
        page: "login",
        colorTheme: "dark-theme",
      }),
    });
  }

  public render(): string {
    return `
            <form class="login-form">
            <div class="inputs-wrapper">
                {{{ InputFirsName }}}
                {{{ InputSecondName }}}
                {{{ InputLogin }}}
                {{{ InputEmail }}}
                {{{ InputPassword }}}
                {{{ InputPhone}}}
            </div>
    
            <div class="btns-wrapper">
    
                {{{ SignUpButton }}}
                {{{ ExitButton }}}
            </div>
            </form>
    `;
  }
}
