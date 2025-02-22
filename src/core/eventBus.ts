export default class EventBus<E extends string> {
  private listeners: Record<E, Array<(...args: unknown[]) => void>>; // Уточнён тип для слушателей

  constructor() {
    this.listeners = {} as Record<E, Array<(...args: unknown[]) => void>>; // Инициализация с явным указанием типа
  }

  on<T extends unknown[]>(event: E, callback: (...args: T) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback as (...args: unknown[]) => void); // Приведение типа
  }

  off<T extends unknown[]>(event: E, callback: (...args: T) => void): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== (callback as (...args: unknown[]) => void), // Приведение типа
    );
  }

  emit<T extends unknown[]>(event: E, ...args: T): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
