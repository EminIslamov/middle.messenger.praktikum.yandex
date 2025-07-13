import Block from "../../../core/block";
import { Button, Modal } from "../../../components";
import InputField from "../../../components/ui/input/inputField";
import { ChatController } from "../../../controllers/ChatController";

interface ActionMenuContentProps extends Record<string, unknown> {
  chatId: number;
  onClose: () => void;
}

interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name?: string;
  login: string;
  avatar?: string;
  role?: string;
}

class AddUserModalContent extends Block {
  constructor() {
    super("div", {
      UserIdInput: new InputField({
        label: "ID пользователя",
        name: "userId",
        colorTheme: "light-theme",
      })
    });
  }

  render() {
    return `
      <div class="modal__form">
        <div class="modal__input">
          {{{ UserIdInput }}}
        </div>
      </div>
    `;
  }
}

class RemoveUserModalContent extends Block {
  constructor() {
    super("div", {
      users: [] as User[],
      isLoading: true
    });
  }

  public setUsers(users: User[]) {
    console.log('Setting users in RemoveUserModalContent:', users);
    this.setProps({
      users: users,
      isLoading: false
    });
  }

  render() {
    console.log('Rendering RemoveUserModalContent with props:', this.props);
    const users = (this.props.users || []) as User[];
    const hasUsers = Array.isArray(users) && users.length > 0;
    console.log('Has users:', hasUsers, 'Users array:', users);

    return `
      <div class="modal__form">
        <div class="modal__input">
          {{#if isLoading}}
            <div class="loader"></div>
          {{else}}
            {{#if ${hasUsers}}}
              <select class="input input_theme_light" name="userId">
                ${users.map(user => `
                  <option value="${user.id}">${user.first_name} ${user.second_name} (ID: ${user.id})</option>
                `).join('')}
              </select>
            {{else}}
              <p>Нет пользователей в чате</p>
            {{/if}}
          {{/if}}
        </div>
      </div>
    `;
  }
}

export default class ActionMenuContent extends Block<ActionMenuContentProps> {
  constructor(props: ActionMenuContentProps) {
    const addUserModalContent = new AddUserModalContent();
    const removeUserModalContent = new RemoveUserModalContent();

    super("div", {
      ...props,
      isAddUserModalOpen: false,
      isRemoveUserModalOpen: false,

      AddUserButton: new Button({
        label: "Добавить пользователя",
        type: "link",
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.stopPropagation();
          this.setProps({ isAddUserModalOpen: true });
        }
      }),

      RemoveUserButton: new Button({
        label: "Удалить пользователя",
        type: "link",
        colorTheme: "light-theme",
        onClick: async (e: Event) => {
          e.stopPropagation();
          this.setProps({ isRemoveUserModalOpen: true });

          try {
            console.log('Fetching users for chat:', this.props.chatId); // Debug log
            const users = await ChatController.getChatUsers(this.props.chatId);
            console.log('Received users from API:', users); // Debug log
            (removeUserModalContent as RemoveUserModalContent).setUsers(users);
          } catch (error) {
            console.error("Failed to load chat users", error);
            (removeUserModalContent as RemoveUserModalContent).setProps({
              isLoading: false,
              users: []
            });
          }
        }
      }),

      AddUserModal: new Modal({
        title: "Добавить пользователя",
        content: addUserModalContent,
        isOpen: false,
        onClose: () => {
          this.setProps({ isAddUserModalOpen: false });
        },
        SubmitButton: new Button({
          label: "Добавить",
          type: "primary",
          colorTheme: "light-theme",
          onClick: async () => {
            const input = addUserModalContent.element?.querySelector('input') as HTMLInputElement;
            const userId = parseInt(input?.value);

            if (userId) {
              try {
                await ChatController.addUsersToChat(this.props.chatId, [userId]);
                this.setProps({ isAddUserModalOpen: false });
              } catch (error) {
                console.error("Failed to add user", error);
              }
            }
          }
        })
      }),

      RemoveUserModal: new Modal({
        title: "Удалить пользователя",
        content: removeUserModalContent,
        isOpen: false,
        onClose: () => {
          this.setProps({ isRemoveUserModalOpen: false });
          (removeUserModalContent as RemoveUserModalContent).setProps({
            isLoading: true,
            users: []
          });
        },
        SubmitButton: new Button({
          label: "Удалить",
          type: "primary",
          colorTheme: "light-theme",
          onClick: async () => {
            const select = removeUserModalContent.element?.querySelector('select') as HTMLSelectElement;
            const userId = parseInt(select?.value);

            if (userId) {
              try {
                (removeUserModalContent as RemoveUserModalContent).setProps({ isLoading: true });

                await ChatController.deleteUsersFromChat(this.props.chatId, [userId]);
                this.setProps({ isRemoveUserModalOpen: false });
              } catch (error) {
                console.error("Failed to remove user", error);
                const users = await ChatController.getChatUsers(this.props.chatId);
                (removeUserModalContent as RemoveUserModalContent).setUsers(users);
              }
            }
          }
        })
      })
    });

    // Добавляем обработчик клика вне меню для его закрытия
    document.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.chat_detail__chat_actions') && this.props.isActionMenuOpen) {
        this.setProps({ isActionMenuOpen: false });
      }
    });
  }

  protected componentDidUpdate(oldProps: ActionMenuContentProps, newProps: ActionMenuContentProps): boolean {
    if (oldProps.isAddUserModalOpen !== newProps.isAddUserModalOpen) {
      (this.children.AddUserModal as Block).setProps({
        isOpen: newProps.isAddUserModalOpen
      });
    }
    if (oldProps.isRemoveUserModalOpen !== newProps.isRemoveUserModalOpen) {
      (this.children.RemoveUserModal as Block).setProps({
        isOpen: newProps.isRemoveUserModalOpen
      });
    }
    return true;
  }

  render() {
    return `
      <div class="action_menu__content">
        <div class="action_menu__item">
          {{{ AddUserButton }}}
        </div>
        <div class="action_menu__item">
          {{{ RemoveUserButton }}}
        </div>
        {{#if isAddUserModalOpen}}
          {{{ AddUserModal }}}
        {{/if}}
        {{#if isRemoveUserModalOpen}}
          {{{ RemoveUserModal }}}
        {{/if}}
      </div>
    `;
  }
}
