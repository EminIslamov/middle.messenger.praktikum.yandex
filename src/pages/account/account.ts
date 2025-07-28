import Block from "../../core/block.ts";
import { Router } from "../../core/router";
import { AuthController } from "../../controllers/AuthController.ts";

import { Button, Modal } from "../../components";
import InputField from "../../components/ui/input/inputField";

import {
  validateEmail,
  validateFirstName,
  validateLogin,
  validatePassword,
  validatePhone,
  validateSecondName,
} from "../../utils/validate.ts";

import DefaultAvatar from "../../icons/default-avatar.png";
import BackIcon from "../../icons/back-btn.svg";

const router = new Router("#app");

interface AccountPageProps {
  [key: string]: unknown;
  isEditing: boolean;
  isPasswordChanging: boolean;
  email: string;
  first_name: string;
  login: string;
  className?: string;
  formState: {
    [key: string]: string;
    email: string;
    login: string;
    first_name: string;
    second_name: string;
    display_name: string;
    phone: string;
    oldPassword: string;
    newPassword: string;
  };
}

class PasswordModalContent extends Block {
  constructor(props: {
    children: { InputOldPassword: Block; InputNewPassword: Block };
  }) {
    super("div", {
      className: "modal__form",
      ...props.children,
    });
  }

  render() {
    return `
      <div class="modal__input">
        {{{ InputOldPassword }}}
      </div>
      <div class="modal__input">
        {{{ InputNewPassword }}}
      </div>
    `;
  }
}

export default class AccountPage extends Block<AccountPageProps> {
  constructor() {
    const inputOldPassword = new InputField({
      label: "Введите текущий пароль",
      colorTheme: "light-theme",
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
    });

    const inputNewPassword = new InputField({
      label: "Введите новый пароль",
      colorTheme: "light-theme",
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
    });

    const modalContent = new PasswordModalContent({
      children: {
        InputOldPassword: inputOldPassword,
        InputNewPassword: inputNewPassword,
      },
    });

    super("div", {
      className: "main_layout",
      isEditing: false,
      isPasswordChanging: false,
      email: "",
      first_name: "",
      login: "",
      avatar: "",
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
      events: {
        submit: (e: Event) => {
          e.preventDefault();
          this.handleSubmit();
        },
      },
      InputAvatar: new InputField({
        name: "avatar",
        htmlType: "file",
        onChange: async (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.files && target.files[0]) {
            try {
              const result = await AuthController.updateAvatar(target.files[0]);
              console.log("Avatar update response:", result);

              // Обновляем URL аватара после успешной загрузки
              const avatarUrl = result.avatar
                ? `https://ya-praktikum.tech/api/v2/resources${result.avatar}`
                : DefaultAvatar;

              this.setProps({ avatar: avatarUrl });
            } catch (error) {
              console.error("Failed to update avatar", error);
            }
          }
        },
      }),

      InputEmail: new InputField({
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

      InputLogin: new InputField({
        label: "Введите логин",
        colorTheme: "light-theme",
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

      InputFirsName: new InputField({
        label: "Введите имя",
        colorTheme: "light-theme",
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

      InputSecondName: new InputField({
        label: "Введите фамилию",
        colorTheme: "light-theme",
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

      InputDisplayName: new InputField({
        label: "Введите имя в чате",
        colorTheme: "light-theme",
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

      InputPhone: new InputField({
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

      InputOldPassword: inputOldPassword,
      InputNewPassword: inputNewPassword,

      SaveButton: new Button({
        label: "Сохранить",
        type: "primary",
        htmlType: "submit",
        colorTheme: "light-theme",
        onClick: async (e: Event) => {
          e.preventDefault();
          await this.handleSubmit();
        },
      }),

      EditButton: new Button({
        label: "Редактировать",
        type: "primary",
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.preventDefault();

          this.setProps({ isEditing: true });
        },
      }),

      ExitButton: new Button({
        label: "Выйти",
        type: "link",
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.preventDefault();

          AuthController.logout(router);
        },
      }),

      ChangePasswordButton: new Button({
        label: "Изменить пароль",
        type: "link",
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.preventDefault();
          this.setProps({ isPasswordChanging: true });
          (this.children.PasswordModal as Block).setProps({ isOpen: true });
        },
      }),

      PasswordModal: new Modal({
        isOpen: false,
        title: "Изменить пароль",
        content: modalContent,
        onClose: () => {
          console.log("Modal closing");
          this.setProps({ isPasswordChanging: false });
          (this.children.PasswordModal as Block).setProps({ isOpen: false });
        },
        SubmitButton: new Button({
          label: "Сохранить",
          type: "primary",
          colorTheme: "light-theme",
          onClick: async (e: Event) => {
            e.preventDefault();
            const { oldPassword, newPassword } = this.props.formState as {
              oldPassword: string;
              newPassword: string;
            };
            if (oldPassword && newPassword) {
              try {
                await AuthController.changePassword({
                  oldPassword,
                  newPassword,
                });
                this.setProps({ isPasswordChanging: false });
                (this.children.PasswordModal as Block).setProps({
                  isOpen: false,
                });
                this.setProps({
                  formState: {
                    ...this.props.formState,
                    oldPassword: "",
                    newPassword: "",
                  },
                });
              } catch (error) {
                console.error("Failed to change password", error);
              }
            }
          },
        }),
        CloseButton: new Button({
          label: "Закрыть",
          type: "link",
          colorTheme: "light-theme",
          onClick: (e: Event) => {
            e.preventDefault();
            this.setProps({ isPasswordChanging: false });
            (this.children.PasswordModal as Block).setProps({ isOpen: false });
          },
        }),
      }),
    });

    // Вызов getUser при инициализации компонента
    this.fetchUserData();
  }

  private async handleSubmit() {
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
        field: "oldPassword",
        validate: validatePassword,
        input: "InputOldPassword",
      },
      {
        field: "newPassword",
        validate: validatePassword,
        input: "InputNewPassword",
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
      try {
        const formState = this.props.formState as {
          email: string;
          login: string;
          first_name: string;
          second_name: string;
          display_name: string;
          phone: string;
          oldPassword: string;
          newPassword: string;
        };

        const { oldPassword, newPassword, ...userData } = formState;
        console.log("Updating user data:", userData);
        await AuthController.updateUser(userData);

        // Если есть старый и новый пароль, обновляем пароль
        if (oldPassword && newPassword) {
          console.log("Updating password");
          await AuthController.changePassword({ oldPassword, newPassword });
        }

        // Обновляем данные на странице
        await this.fetchUserData();
        this.setProps({ isEditing: false });
      } catch (error) {
        console.error("Failed to update user data", error);
      }
    }
  }

  async fetchUserData() {
    try {
      const userData = await AuthController.getUser();
      console.log("User data:", userData);

      // Добавляем базовый URL к пути аватара, если он есть
      const avatarUrl = userData.avatar
        ? `https://ya-praktikum.tech/api/v2/resources${userData.avatar}`
        : DefaultAvatar;

      this.setProps({
        email: userData.email,
        first_name: userData.first_name,
        second_name: userData.second_name,
        display_name: userData.display_name,
        phone: userData.phone,
        login: userData.login,
        avatar: avatarUrl,
      });
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  }

  public render(): string {
    return `
      <div class="account">
        <a href="/messenger" class="account__back_button">
          <img src="${BackIcon}" alt="back_icon"/>
        </a>

        <div class="account__avatar">
          <img src="${this.props.avatar}" alt="avatar"/>
        </div>

        <div class="account__avatar_input">
          {{{ InputAvatar }}}
        </div>

        <form onsubmit="return false;">
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
            {{else}}
              <div class="account__row">
                <div class="account__title">Пароль:</div>
                <div class="account__text account__password">
                  {{{ ChangePasswordButton }}}
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
        </form>
      </div>

      {{#if isPasswordChanging}}
        {{{ PasswordModal }}}
      {{/if}}
    `;
  }
}
