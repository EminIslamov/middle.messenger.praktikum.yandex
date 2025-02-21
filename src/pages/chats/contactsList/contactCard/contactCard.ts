import Block from "../../../../core/block";

interface ContactCardProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadMessages: number;
}

export default class ContactCard extends Block {
  constructor(props: ContactCardProps) {
    super("div", { props });
  }

  public render(): string {
    return `
            <div class="contact_card">
                <div class="contact_card__avatar">
                    <img src="" alt="avatar"/>
                </div>

                <div class="contact_card__info">
                    <div class="contact_card__name">{{ name }}</div>
                    <div class="contact_card__last_message">{{ lastMessage }}</div>
                </div>

                <div class="contact_card__right">
                    <div class="contact_card__time">{{ time }}</div>
                    <div class="unread_messages_count contact_card___unread_messages">{{ unreadMessages }}</div>
                </div>
            </div>
        `;
  }
}
