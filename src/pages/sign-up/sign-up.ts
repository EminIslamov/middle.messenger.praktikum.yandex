import Block from "../../core/block.ts";
import {Button, Input} from "../../components";
import {
    validateEmail,
    validateFirstName,
    validateLogin, validatePassword,
    validatePhone,
    validateSecondName
} from "../../utils/validate.ts";

export default class SignUpPage extends Block{
    constructor() {
        super("div", {
            className: "container",
            email: "leocherep@mail.ru",
            first_name: 'Леонардо',
            login: 'turtle',
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

                onBlur: (e: FocusEvent) => {
                    const error = validateEmail(this.props.formState.email)

                    if (error) {
                        this.children.InputEmail.setProps({
                            error,
                        });
                    }
                },
                onChange: (e: Event) => {
                    this.children.InputEmail.setProps({
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

            InputFirsName: new Input({
                label: "Введите имя",
                name: "first_name",
                onBlur: (e: FocusEvent) => {
                    const error = validateFirstName(this.props.formState.first_name)

                    if (error) {
                        this.children.InputFirsName.setProps({
                            error,
                        });
                    }
                },
                onChange: (e: Event) => {
                    this.children.InputFirsName.setProps({
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
                onBlur: (e: FocusEvent) => {
                    const error = validateSecondName(this.props.formState.second_name)

                    if (error) {
                        this.children.InputSecondName.setProps({
                            error,
                        });
                    }
                },
                onChange: (e: Event) => {
                    console.log("onChange triggered");


                    this.children.InputSecondName.setProps({
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

                onBlur: (e: FocusEvent) => {
                    const error = validatePhone(this.props.formState.phone)

                    if (error) {
                        this.children.InputPhone.setProps({
                            error,
                        });
                    }
                },
                onChange: (e: Event) => {
                    this.children.InputPhone.setProps({
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

            SignUpButton: new Button({
                label: "Зарегистрироваться",
                type: "primary",
                page: "signup",
                onClick: (e: MouseEvent) => {
                    e.preventDefault();
                    const validators = [
                        { field: 'email', validate: validateEmail, input: 'InputEmail' },
                        { field: 'login', validate: validateLogin, input: 'InputLogin' },
                        { field: 'first_name', validate: validateFirstName, input: 'InputFirsName' },
                        { field: 'second_name', validate: validateSecondName, input: 'InputSecondName' },
                        { field: 'phone', validate: validatePhone, input: 'InputPhone' },
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
            ExitButton: new Button({
                label: "Перейти к авторизации",
                type: "link",
                page: "login",
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