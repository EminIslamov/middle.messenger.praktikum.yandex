import { Button, Input } from "../../components";
import Block from "../../core/block";
import {
    validateEmail,
    validateFirstName,
    validateLogin,
    validatePassword, validatePhone,
    validateSecondName
} from "../../utils/validate.ts";

interface LoginPageProps {
    className?: string;
    formState: {
        login: string;
        password: string;
    };
    errors: {
        login: string;
        password: string;
    };
    [key: string]: any; // Если у вас есть другие динамические свойства
}

export default class LoginPage extends Block {
    constructor(props: LoginPageProps) {
        super("div", {
            ...props,
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
                onBlur: (e: FocusEvent) => {
                    const error = validateLogin(this.props.formState.login)

                    if (error) {
                        this.children.InputLogin.setProps({
                            error,
                        });
                    }
                },
                onChange: (e: Event) => {
                    this.children.InputLogin.setProps({
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

            InputPassword: new Input({
                label: "Введите Пароль",
                name: "password",
                onBlur: (e: FocusEvent) => {
                    const error = validatePassword(this.props.formState.password)

                    if (error) {
                        this.children.InputPassword.setProps({
                            error,
                        });
                    }
                },
                onChange: (e: Event) => {
                    this.children.InputPassword.setProps({
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

            SignInButton: new Button({
                label: "Войти",
                type: "primary",
                page: "signup",
                onClick: (e: MouseEvent) => {
                    e.preventDefault();

                    const validators = [
                        { field: 'login', validate: validateLogin, input: 'InputLogin' },
                        { field: 'password', validate: validatePassword, input: 'InputPassword' },
                    ];

                    let isValid = true;

                    // Пробегаем по всем полям и валидаторам
                    validators.forEach(({ field, validate, input }) => {
                        const error = validate(this.props.formState[field]);
                        if (error) {
                            this.children[input].setProps({ error });
                            isValid = false;
                        } else {
                            this.children[input].setProps({ error: "" });
                        }
                    });

                    if (isValid) {
                        console.log(this.props.formState);
                    }
                },
            }),
            SignUpButton: new Button({
                label: "Перейти к регистрации",
                type: "link",
                page: "signup",
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