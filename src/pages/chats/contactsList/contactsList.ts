import Block from "../../../core/block";
import Handlebars from "handlebars";
import { Router } from "../../../core/router";
import DefaultAvatar from "../../../icons/default-avatar.png";
import { formatMessageTime } from "../../../utils/formatDate";

Handlebars.registerHelper('formatTime', function(time: string) {
  return time ? formatMessageTime(time) : '';
});

export default class ContactsList extends Block {
  constructor() {
    super("div", {
      contacts: [],
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          const card = target.closest('.contact_card');
          if (card) {
            const chatId = card.getAttribute('data-id');
            if (chatId) {
              const router = new Router("#app");
              router.go(`/messenger/${chatId}`);
            }
          }
        }
      }
    });
  }

  public render(): string {
    const template = `
            <div class="contacts_list">
                {{#each contacts}}
                    <div class="contact_card" data-id="{{id}}">
                        <div class="contact_card__avatar">
                            <img src="${DefaultAvatar}" alt="avatar"/>
                        </div>

                        <div class="contact_card__info">
                            <div class="contact_card__name">{{{ title }}}</div>
                            <div class="contact_card__last_message">{{{ last_message.content }}}</div>
                        </div>

                        <div class="contact_card__right">
                            <div class="contact_card__time">{{formatTime last_message.time}}</div>
                            <div class="unread_messages_count contact_card___unread_messages">{{{ unread_count }}}</div>
                        </div>
                    </div>
                {{/each}}
            </div>
        `;

    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({ contacts: this.props.contacts });
  }
}
