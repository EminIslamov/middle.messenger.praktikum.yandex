import Handlebars from "handlebars";
import Block from "../../../core/block";
import { formatMessageTime } from "../../../utils/formatDate";

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('formatTime', function(time: string) {
  return time ? formatMessageTime(time) : '';
});

interface Message {
  id: number;
  user_id: number;
  chat_id: number;
  type: string;
  time: string;
  content: string;
  is_read: boolean;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

interface MessagesListProps extends Record<string, unknown> {
  messages: Message[];
  currentUserId?: number;
}

class MessagesList extends Block<MessagesListProps> {
  constructor() {
    super("div", {
      messages: [],
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = this.element?.querySelector('.messages_list');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 0);
  }

  public setMessages(messages: Message[]) {
    const sortedMessages = [...messages].sort((a, b) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    this.setProps({ messages: sortedMessages });
    this.scrollToBottom();
  }

  public addMessage(message: Message) {
    const newMessages = [...this.props.messages, message].sort((a, b) =>
      new Date(a.time).getTime() - new Date(b.time).getTime()
    );

    this.setProps({ messages: newMessages });
    this.scrollToBottom();
  }

  protected componentDidMount() {
    this.scrollToBottom();
    return true;
  }

  protected componentDidUpdate() {
    this.scrollToBottom();
    return true;
  }

  public render(): string {
    const { messages, currentUserId } = this.props;

    const template = `
      <div class="messages_list">
        {{#if messages.length}}
          {{#each messages}}
            <div class="message_card {{#if (eq user_id ../currentUserId)}}message--outgoing{{else}}message--incoming{{/if}}">
              <div class="message_card__content">
                <div class="message_card__text">{{content}}</div>
                <div class="message_card__time">{{formatTime time}}</div>
              </div>
            </div>
          {{/each}}
        {{else}}
          <div class="chat_detail__no_messages">
            Нет сообщений
          </div>
        {{/if}}
      </div>
    `;

    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate({ messages, currentUserId });
  }
}

export { MessagesList };
export type { Message };
