import Block from "../../core/block";
import { ContactsList } from "./contactsList";
import { SearchInput } from "../../components/searchInput";
import ActionMenuIcon from "../../icons/action-menu.svg";
import PinIcon from "../../icons/pin-icon.svg";
import { MessagesList } from "./messagesList";
import { Input } from "../../components/ui/input";
import { validateMessage } from "../../utils/validate";
import { Button } from "../../components/ui/button";

export default class ChatsPage extends Block {
  constructor() {
    super("div", {
      isChatChosen: true,
      formState: {
        message: "",
      },

      errors: {
        message: "",
      },

      ContactsList: new ContactsList(),
      SearchInput: new SearchInput(),
      MessagesList: new MessagesList(),

      MessageInput: new Input({
        name: "message",
        colorTheme: "light-theme",
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
        colorTheme: "light-theme",
        onClick: (e: Event) => {
          e.preventDefault();

          const value = this.props.formState?.message as string;
          if (value !== undefined) {
            const error = validateMessage(value);
            if (error) {
              (this.children.MessageInput as Block).setProps({ error });
            } else {
              (this.children.MessageInput as Block).setProps({ error: "" });
              console.log(this.props.formState);
            }
          }
        },
      }),
    });
  }

  public render(): string {
    return `
            <div class="chats">
                <div class="chats__contacts">
                    <div class="contacts__header">
                        <div class="contacts__profile_link profile_link">
                            <a href="/profile">
                                Профиль >
                            </a>
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
                          <img src="" alt="avatar"/>
                        </div>

                        <div class="contact_info__name">
                          Александр
                        </div>
                      </div>

                      <div class="chat_detail__chat_actions">
                        <div class="chat_detail__chat_actions__button">
                          <img src="${ActionMenuIcon}" "menu_icon"/>
                        </div>
                      </div>
                    </div>

                    <div class="chat_detail__messages_list">
                      {{{ MessagesList }}}
                    </div>

                    <div class="chat_detail__message_input">
                      <div class="message_input__pin_icon">
                        <img src="${PinIcon}" alt="pin_icon"/>
                      </div>

                      {{{ MessageInput }}}

                      <div class="message_input__send_button">
                        {{{ SendButton }}}
                      </div>
                    </div>

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
