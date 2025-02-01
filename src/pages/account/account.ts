import Block from "../../core/block.ts";
import { Button, Input } from "../../components";
import {
    validateEmail,
    validateFirstName,
    validateLogin,
    validatePassword,
    validatePhone, validateSecondName
} from "../../utils/validate.ts";

export default class AccountPage extends Block {
  constructor() {
      super("div", {
          className: "main_layout",
          isEditing: false,
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
              oldPassword: "",
              newPassword: "",
          },

          InputAvatar: new Input({
              name: "avatar",
              htmlType: "file",
          }),

          InputEmail: new Input({
              label: "Введите почту",
              name: "email",
              colorTheme: "light-theme",

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
              colorTheme: 'light-theme',
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
              colorTheme: 'light-theme',
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
              colorTheme: 'light-theme',
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

          InputDisplayName: new Input({
              label: "Введите имя в чате",
              colorTheme: 'light-theme',
              name: "display_name",
              onChange: (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  const value = target.value;

                  this.setProps({
                      formState: {
                          ...this.props.formState,
                          display_name: value,
                      },
                  });
              },
          }),

          InputPhone: new Input({
              label: "Введите номер телефона",
              name: "phone",
              colorTheme: "light-theme",

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

          InputOldPassword: new Input({
              label: "Введите текущий пароль",
              colorTheme: 'light-theme',
              name: "oldPassword",
              onBlur: (e: FocusEvent) => {
                  const error = validatePassword(this.props.formState.oldPassword)

                  if (error) {
                      this.children.InputOldPassword.setProps({
                          error,
                      });
                  }
              },
              onChange: (e: Event) => {
                  this.children.InputOldPassword.setProps({
                      error: "",
                  });

                  const target = e.target as HTMLInputElement;
                  const value = target.value;

                  this.setProps({
                      formState: {
                          ...this.props.formState,
                          oldPassword: value,
                      },
                  });
              },
          }),

          InputNewPassword: new Input({
              label: "Введите новый пароль",
              colorTheme: 'light-theme',
              name: "newPassword",
              onBlur: (e: FocusEvent) => {
                  const error = validatePassword(this.props.formState.newPassword)

                  if (error) {
                      this.children.InputNewPassword.setProps({
                          error,
                      });
                  }
              },
              onChange: (e: Event) => {
                  this.children.InputNewPassword.setProps({
                      error: "",
                  });

                  const target = e.target as HTMLInputElement;
                  const value = target.value;

                  this.setProps({
                      formState: {
                          ...this.props.formState,
                          newPassword: value,
                      },
                  });
              },
          }),

          SaveButton: new Button({
              label: "Сохранить",
              type: "primary",
              onClick: (e: MouseEvent) => {
                  e.preventDefault();
                  const validators = [
                      { field: 'email', validate: validateEmail, input: 'InputEmail' },
                      { field: 'login', validate: validateLogin, input: 'InputLogin' },
                      { field: 'first_name', validate: validateFirstName, input: 'InputFirsName' },
                      { field: 'second_name', validate: validateSecondName, input: 'InputSecondName' },
                      { field: 'phone', validate: validatePhone, input: 'InputPhone' },
                      { field: 'oldPassword', validate: validatePassword, input: 'InputOldPassword' },
                      { field: 'newPassword', validate: validatePassword, input: 'InputNewPassword' },
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

          EditButton: new Button({
              label: "Редактировать",
              type: "primary",
              onClick: (e: MouseEvent) => {
                  e.preventDefault();

                  this.setProps({ isEditing: true })
              },
          }),

          ExitButton: new Button({
              label: "Выйти",
              type: "link",
              colorTheme: 'light-theme',
          }),
      });
  }

    public render(): string {
        return `
       <div class="account">

        <div class="account__avatar"></div>

        {{#if isEditing}}
                {{{ InputAvatar }}}
        {{/if}}
        
        <form>
            <div class="account__data">
                {{#if isEditing}}
                    <div class="account__row--editing">
                        {{{ InputEmail }}}
                    </div>
                {{else}}
                    <div class="account__row">
                        <div class="account__title">Почта:</div>
                        <div class="account__text">
                            {{#if email}}
                                {{email}}
                            {{/if}}
                        </div>
                    </div>
                {{/if}}
                
                 {{#if isEditing}}
                    <div class="account__row--editing">
                        {{{ InputLogin }}}
                    </div>
                {{else}}
                    <div class="account__row">
                        <div class="account__title">Логин:</div>
                        <div class="account__text">
                            {{#if login}}
                                {{login}}
                            {{/if}}
                        </div>
                    </div>
                {{/if}}
                
                {{#if isEditing}}
                    <div class="account__row--editing">
                        {{{ InputFirsName }}}
                    </div>
                {{else}}
                    <div class="account__row">
                        <div class="account__title">Имя:</div>
                        <div class="account__text">
                            {{#if first_name}}
                                {{first_name}}
                            {{/if}}
                        </div>
                    </div>
                {{/if}}

                {{#if isEditing}}
                    <div class="account__row--editing">
                        {{{ InputSecondName }}}
                    </div>
                {{else}}
                    <div class="account__row">
                        <div class="account__title">Фамилия:</div>
                        <div class="account__text">
                            {{#if second_name}}
                                {{second_name}}
                            {{/if}}
                        </div>
                    </div>
                {{/if}}

                {{#if isEditing}}
                    <div class="account__row--editing">
                        {{{ InputDisplayName }}}
                    </div>
                {{else}}
                    <div class="account__row">
                        <div class="account__title">Имя в чате:</div>
                        <div class="account__text">
                            {{#if display_name}}
                                {{display_name}}
                            {{/if}}
                        </div>
                    </div>
                {{/if}}

                {{#if isEditing}}
                    <div class="account__row--editing">
                        {{{ InputPhone }}}
                    </div>
                {{else}}
                    <div class="account__row">
                        <div class="account__title">Телефон</div>
                        <div class="account__text">
                            {{#if phone}}
                                {{phone}}
                            {{/if}}
                        </div>
                    </div>
                {{/if}}

                {{#if isEditing}}
                    <div class="account__row--editing">
                        {{{ InputOldPassword }}}
                    </div><div class="account__row--editing">
                        {{{  InputNewPassword }}} 
                    </div>
                {{else}}
                    <div class="account__row">
                        <div class="account__title">Пароль:</div>
                        <div class="account__text account__password">
                            Изменить пароль
                        </div>
                    </div>
                {{/if}}
            </div>
            
            <div class="account__buttons">

                {{#if isEditing}}
                    {{{ SaveButton }}}
                {{else}}
                    {{{ EditButton }}}
                {{/if}}

                {{{ ExitButton }}}
            </div>
        </div>    
        </form>
    </div>
    `;
    }
}