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
              colorTheme: 'light-theme',
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
              colorTheme: 'light-theme',
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
              colorTheme: 'light-theme',
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

          InputOldPassword: new Input({
              label: "Введите текущий пароль",
              colorTheme: 'light-theme',
              name: "oldPassword",
              onBlur: () => {
                  const value = this.props.formState?.oldPassword as string;
                  if (value !== undefined) {
                      const error = validatePassword(value);
                      if (error) {
                          (this.children.InputOldPassword as Block).setProps({ error });
                      }
                  }
              },
              onChange: (e: Event) => {
                  (this.children.InputOldPassword as Block).setProps({
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
              onBlur: () => {
                  const value = this.props.formState?.newPassword as string;
                  if (value !== undefined) {
                      const error = validatePassword(value);
                      if (error) {
                          (this.children.InputNewPassword as Block).setProps({ error });
                      }
                  }
              },
              onChange: (e: Event) => {
                  (this.children.InputNewPassword as Block).setProps({
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
              colorTheme: 'light-theme',
              onClick: (e: Event) => {
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

          EditButton: new Button({
              label: "Редактировать",
              type: "primary",
              colorTheme: 'light-theme',
              onClick: (e: Event) => {
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