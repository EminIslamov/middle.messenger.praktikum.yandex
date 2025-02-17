import Block from "../../../core/block";
import Handlebars from "handlebars";

export default class ContactsList extends Block {
    constructor() {
        super("div", {
            contacts: [
                {
                    id: "1",
                    name: "Александр",
                    lastMessage: "Привет",
                    time: "12:00",
                    unreadMessages: '10',
                },
                {
                    id: "2",
                    name: "Игорь",
                    lastMessage: "Как дела?",
                    time: "12:00",
                    unreadMessages: '10',
                },
                {
                    id: "3",
                    name: "Павел",
                    lastMessage: "Как дела?",
                    time: "12:00",
                    unreadMessages: '10',
                },
                {
                    id: "4",
                    name: "Александр",
                    lastMessage: "Привет",
                    time: "12:00",
                    unreadMessages: '10',
                },
                {
                    id: "5",
                    name: "Александр",
                    lastMessage: "Привет",
                    time: "12:00",
                    unreadMessages: '10',
                },
            ],
        });
    }

    public render(): string {
        const template = `
            <div class="contacts_list">
                {{#each contacts}}
                    <div class="contact_card">
                        <div class="contact_card__avatar">
                            <img src=""  />
                        </div>

                        <div class="contact_card__info">
                            <div class="contact_card__name">{{{ name }}}</div>
                            <div class="contact_card__last_message">{{{ lastMessage }}}</div>
                        </div>

                        <div class="contact_card__right">
                            <div class="contact_card__time">{{{ time }}}</div>
                            <div class="unread_messages_count contact_card___unread_messages">{{{ unreadMessages }}}</div>
                        </div>
                    </div>
                {{/each}}
            </div>
        `;

        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate({ contacts: this.props.contacts });
    }
}