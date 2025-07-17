import Block from "../../core/block";
import { ContactsList } from "./contactsList";
import { SearchInput } from "../../components/searchInput";
import ActionMenuIcon from "../../icons/action-menu.svg";
import PinIcon from "../../icons/pin-icon.svg";
import DefaultAvatar from "../../icons/default-avatar.png";
import { MessagesList } from "./messagesList";
import { Input } from "../../components/ui/input";
import { validateMessage } from "../../utils/validate";
import { Button, Modal, ActionMenu } from "../../components";
import { Router } from "../../core/router";
import { ChatController } from "../../controllers/ChatController";
import { ChatCreateModalContent } from "./chatCreateModal";
import InputField from "../../components/ui/input/inputField";
import ActionMenuContent from "./chatActionMenuContent/chatActionMenuContent";
import MessagesController from "../../controllers/MessagesController";

const router = new Router("#app");

interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
}

interface ChatsPageProps extends Record<string, unknown> {
  routeParams?: {
    id?: string;
  };
  currentChat?: Chat;
  isChatChosen: boolean;
  isChatCreating: boolean;
  isActionMenuOpen: boolean;
  formState: {
    message: string;
    chatTitle: string;
  };
  errors?: {
    message: string;
  };
}

export default class ChatsPage extends Block<ChatsPageProps> {
  private messagesController: MessagesController | null = null;

  constructor() {
    const chatTitleInput = new InputField({
      label: "Введите название чата",
      colorTheme: "light-theme",
      name: "chatTitle",
      onChange: (e: Event) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;

        this.setProps({
          formState: {
            ...this.props.formState,
            chatTitle: value,
          },
        });
      },
    });

    const modalContent = new ChatCreateModalContent({
      children: {
        ChatTitleInput: chatTitleInput,
      },
    });

    super("div", {
      isChatChosen: false,
      isChatCreating: false,
      isActionMenuOpen: false,
      formState: {
        message: "",
        chatTitle: "",
      },
      errors: {
        message: "",
      },
      events: {
        submit: async (e: Event) => {
          e.preventDefault();
          await this.handleMessageSubmit();
        },
      },
      ContactsList: new ContactsList(),
      SearchInput: new SearchInput(),
      MessagesList: new MessagesList(),

      ChatCreateModal: new Modal({
        isOpen: false,
        title: "Создание чата",
        content: modalContent,
        onClose: () => {
          console.log("Modal closing");
          this.setProps({ isPasswordChanging: false });
          (this.children.ChatCreateModal as Block).setProps({ isOpen: false });
        },
        SubmitButton: new Button({
          label: "Сохранить",
          type: "primary",
          htmlType: "submit",
          colorTheme: "light-theme",
          onClick: async (e: Event) => {
            e.preventDefault();
            const chatTitle = (
              chatTitleInput.element?.querySelector("input") as HTMLInputElement
            )?.value;
            if (chatTitle) {
              try {
                await ChatController.createChat(chatTitle);
                this.setProps({ isChatCreating: false });
                (this.children.ChatCreateModal as Block).setProps({
                  isOpen: false,
                });
                this.setProps({
                  formState: {
                    ...this.props.formState,
                    chatTitle: "",
                  },
                });
                await this.fetchChats();
              } catch (error) {
                console.error("Failed to create chat", error);
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
            this.setProps({ isChatCreating: false });
            (this.children.ChatCreateModal as Block).setProps({
              isOpen: false,
            });
          },
        }),
      }),

      MessageInput: new Input({
        name: "message",
        colorTheme: "light-theme",
        value: "",
        onBlur: () => {
          const value = this.props.formState?.message as string;
          if (value !== undefined) {
            const error = validateMessage(value);
            if (error) {
              (this.children.MessageInput as Block).setProps({ error });
            }
          }
        },
        onChange: (e: Event) => {
          (this.children.MessageInput as Block).setProps({
            error: "",
            value: (e.target as HTMLInputElement).value,
          });

          const target = e.target as HTMLInputElement;
          const value = target.value;

          this.setProps({
            formState: {
              ...this.props.formState,
              message: value,
            },
          });
        },
      }),

      SendButton: new Button({
        label: "Отправить",
        type: "primary",
        htmlType: "submit",
        colorTheme: "light-theme",
        onClick: async (e: Event) => {
          e.preventDefault();
          await this.handleMessageSubmit();
        },
      }),
      ProfileButton: new Button({
        label: "Профиль",
        type: "primary",
        colorTheme: "light",
        onClick: (e: Event) => {
          e.preventDefault();
          router.go("/settings");
        },
      }),

      AddChatButton: new Button({
        label: "Новый чат",
        type: "primary",
        colorTheme: "light",
        onClick: (e: Event) => {
          e.preventDefault();
          this.setProps({ isChatCreating: true });
          (this.children.ChatCreateModal as Block).setProps({ isOpen: true });
        },
      }),

      ActionButton: new Button({
        type: "link",
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.props.currentChat?.id) {
            this.setProps({
              isActionMenuOpen: !this.props.isActionMenuOpen,
            });
          }
        },
        label: `<img src="${ActionMenuIcon}" alt="menu_icon"/>`,
      }),
    });

    // Создаем ActionMenu только если есть выбранный чат
    if (this.props.currentChat?.id) {
      const actionMenuContent = new ActionMenuContent({
        chatId: this.props.currentChat.id,
        onClose: () => {
          this.setProps({ isActionMenuOpen: false });
        },
      });

      this.children.ActionMenu = new ActionMenu({
        isOpen: false,
        content: actionMenuContent,
        onClose: () => {
          this.setProps({ isActionMenuOpen: false });
        },
      });
    }

    // Добавляем обработчик клика вне меню для его закрытия
    document.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".chat_detail__chat_actions") &&
        this.props.isActionMenuOpen
      ) {
        this.setProps({ isActionMenuOpen: false });
      }
    });
  }

  private async handleMessageSubmit() {
    const value = this.props.formState?.message as string;
    if (value !== undefined) {
      const error = validateMessage(value);
      if (error) {
        (this.children.MessageInput as Block).setProps({ error });
      } else {
        (this.children.MessageInput as Block).setProps({ error: "" });

        // Отправляем сообщение через WebSocket
        try {
          this.messagesController?.sendMessage(value);
          // Очищаем поле ввода после отправки
          this.setProps({
            formState: {
              ...this.props.formState,
              message: "",
            },
          });
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      }
    }
  }

  public componentDidMount() {
    this.fetchChats();

    // Если есть id в URL, загружаем конкретный чат
    if (this.props.routeParams?.id) {
      this.loadChat(this.props.routeParams.id);
    }

    return true;
  }

  protected componentDidUpdate(
    oldProps: ChatsPageProps,
    newProps: ChatsPageProps,
  ): boolean {
    if (oldProps.isActionMenuOpen !== newProps.isActionMenuOpen) {
      (this.children.ActionMenu as Block)?.setProps({
        isOpen: newProps.isActionMenuOpen,
      });
    }

    // Обновляем ActionMenu при смене чата
    if (oldProps.currentChat?.id !== newProps.currentChat?.id) {
      if (newProps.currentChat?.id) {
        const actionMenuContent = new ActionMenuContent({
          chatId: newProps.currentChat.id,
          onClose: () => {
            this.setProps({ isActionMenuOpen: false });
          },
        });

        if (!this.children.ActionMenu) {
          this.children.ActionMenu = new ActionMenu({
            isOpen: false,
            content: actionMenuContent,
            onClose: () => {
              this.setProps({ isActionMenuOpen: false });
            },
          });
        } else {
          (this.children.ActionMenu as Block).setProps({
            content: actionMenuContent,
          });
        }
      }
    }

    // Синхронизируем value MessageInput с formState.message
    if (oldProps.formState?.message !== newProps.formState?.message) {
      (this.children.MessageInput as Block).setProps({
        value: newProps.formState?.message || "",
      });
    }

    return true;
  }

  private async fetchChats() {
    try {
      const chats = await ChatController.getChats();
      if (Array.isArray(chats)) {
        (this.children.ContactsList as Block).setProps({ contacts: chats });
      }
    } catch (error) {
      console.error("Ошибка при получении чатов:", error);
    }
  }

  private async initializeWebSocket(userId: number, chatId: number) {
    if (this.messagesController) {
      this.messagesController.closeConnection();
    }

    this.messagesController = new MessagesController(userId);

    // Устанавливаем колбэки для обработки сообщений
    this.messagesController.setCallbacks({
      onMessagesReceived: (messages) => {
        (this.children.MessagesList as MessagesList).setMessages(messages);
        (this.children.MessagesList as MessagesList).setProps({
          currentUserId: userId,
        });
      },
      onNewMessage: (message) => {
        (this.children.MessagesList as MessagesList).addMessage(message);
      },
    });

    await this.messagesController.connect(chatId);
  }

  private async loadChat(chatId: string) {
    try {
      const chats = await ChatController.getChats();
      const chat = chats.find((c: Chat) => c.id.toString() === chatId);

      if (chat) {
        this.setProps({
          currentChat: chat,
          isChatChosen: true,
        });

        // Получаем текущего пользователя и инициализируем WebSocket
        const userResponse = await fetch(
          "https://ya-praktikum.tech/api/v2/auth/user",
          {
            credentials: "include",
          },
        );
        const userData = await userResponse.json();

        await this.initializeWebSocket(userData.id, chat.id);
      } else {
        router.go("/messenger");
      }
    } catch (error) {
      console.error("Ошибка при загрузке чата:", error);
      router.go("/messenger");
    }
  }

  protected componentWillUnmount() {
    if (this.messagesController) {
      this.messagesController.closeConnection();
      this.messagesController = null;
    }
  }

  public render(): string {
    const chatName = this.props.currentChat?.title || "Выберите чат";
    const chatAvatar = this.props.currentChat?.avatar || DefaultAvatar;

    return `
      <div class="chats">
        {{#if isChatCreating}}
          {{{ ChatCreateModal }}}
        {{/if}}
        <div class="chats__contacts">
          <div class="contacts__header">
            <div class="contacts__profile_link profile_link">
              {{{ ProfileButton }}}
              {{{ AddChatButton }}}
            </div>

            <div class="contacts__search">
              {{{ SearchInput }}}
            </div>
          </div>

          <div class="chats__contacts__list">
            {{{ ContactsList }}}
          </div>
        </div>

        <div class="chat_detail">
          {{#if isChatChosen}}
            <div class="chat_detail__header">
              <div class="chat_detail__contact_info contact_info">
                <div class="contact_info__avatar">
                  <img src="${chatAvatar}" alt="avatar"/>
                </div>
                <div class="contact_info__name">
                  ${chatName}
                </div>
              </div>
              <div class="chat_detail__chat_actions">
                {{#if currentChat.id}}
                  {{{ ActionButton }}}
                  {{#if isActionMenuOpen}}
                    {{{ ActionMenu }}}
                  {{/if}}
                {{/if}}
              </div>
            </div>

            <div class="chat_detail__messages_list">
              {{{ MessagesList }}}
            </div>

              <form class="chat_detail__message_form" onsubmit="return false;">
               <div class="message_input__pin_icon">
                    <img src="${PinIcon}" alt="pin_icon"/>
                  </div>
                <div class="message_input__input_wrapper">

                  {{{ MessageInput }}}
                </div>

                <div class="message_input__send_button">
                  {{{ SendButton }}}
                </div>
              </form>

          {{else}}
            <div class="chat_detail__chose_chat">
              Выберите чат, чтобы отправить сообщение
            </div>
          {{/if}}
        </div>
      </div>
    `;
  }
}
