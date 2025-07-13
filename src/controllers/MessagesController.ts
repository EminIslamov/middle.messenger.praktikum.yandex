import { ChatController } from "./ChatController";

type MessageCallback = (messages: Message[]) => void;
type NewMessageCallback = (message: Message) => void;

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

class MessagesController {
  private static BASE_URL = 'wss://ya-praktikum.tech/ws/chats';
  private socket: WebSocket | null = null;
  private userId: number;
  private chatId: number = 0;
  private ping: ReturnType<typeof setInterval> | null = null;
  private onMessagesReceived: MessageCallback | null = null;
  private onNewMessage: NewMessageCallback | null = null;

  constructor(userId: number) {
    this.userId = userId;
  }

  public setCallbacks(callbacks: {
    onMessagesReceived?: MessageCallback;
    onNewMessage?: NewMessageCallback;
  }) {
    if (callbacks.onMessagesReceived) {
      this.onMessagesReceived = callbacks.onMessagesReceived;
    }
    if (callbacks.onNewMessage) {
      this.onNewMessage = callbacks.onNewMessage;
    }
  }

  async connect(chatId: number) {
    if (this.socket) {
      this.socket.close();
    }

    this.chatId = chatId;

    try {
      const { token } = await ChatController.getChatToken(chatId);

      this.socket = new WebSocket(`${MessagesController.BASE_URL}/${this.userId}/${chatId}/${token}`);

      this.socket.addEventListener('open', this.handleOpen.bind(this));
      this.socket.addEventListener('close', this.handleClose.bind(this));
      this.socket.addEventListener('message', this.handleMessage.bind(this));
      this.socket.addEventListener('error', this.handleError.bind(this));
    } catch (error) {
      console.error('Error connecting to chat:', error);
    }
  }

  private handleOpen() {
    console.log('WebSocket connection established');
    this.getMessages();
    this.ping = setInterval(() => {
      this.socket?.send(JSON.stringify({
        type: 'ping'
      }));
    }, 10000);
  }

  private handleClose(event: CloseEvent) {
    console.log('WebSocket connection closed', event);
    if (this.ping) {
      clearInterval(this.ping);
      this.ping = null;
    }

    if (event.wasClean) {
      console.log('Connection closed cleanly');
    } else {
      console.log('Connection interrupted');
      setTimeout(() => {
        this.connect(this.chatId);
      }, 5000);
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        console.log('Received message history:', data);
        if (this.onMessagesReceived) {
          this.onMessagesReceived(data);
        }
      } else if (data.type === 'message') {
        console.log('Received new message:', data);
        if (this.onNewMessage) {
          this.onNewMessage(data);
        }
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  private handleError(event: Event) {
    console.error('WebSocket error:', event);
  }

  private getMessages(offset = 0) {
    this.socket?.send(JSON.stringify({
      content: offset.toString(),
      type: 'get old',
    }));
  }

  public sendMessage(content: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket connection not established');
    }

    this.socket.send(JSON.stringify({
      content,
      type: 'message',
    }));
  }

  public closeConnection() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    if (this.ping) {
      clearInterval(this.ping);
      this.ping = null;
    }
  }
}

export default MessagesController;
