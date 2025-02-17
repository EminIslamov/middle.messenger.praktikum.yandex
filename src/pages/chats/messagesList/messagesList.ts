import Handlebars from "handlebars";
import Block from "../../../core/block";

export default class MessagesList extends Block {
    constructor() {
        super("div", {
            messages: [
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__outgoing",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__outgoing",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                {
                    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
                    time: "12:00",
                    direction: "message_card__incoming",
                },
                
            ],
        });
    }
    
    public render(): string {
        const template = `
            <div class="messages_list">
                {{#each messages}}
                    <div class="message_card {{direction}}">
                        <div class="message_card__message">
                            <div class="message_card__message__text">
                                {{{ text }}}
                            </div>

                            <div class="message_card__message__time">
                                {{{ time }}}
                            </div>
                        </div>
                    </div>
                {{/each}}
            </div>
        `;

        const compiledTemplate = Handlebars.compile(template);
        return compiledTemplate({ messages: this.props.messages });
    }
}