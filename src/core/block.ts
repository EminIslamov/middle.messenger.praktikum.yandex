import EventBus from "./eventBus";
import { nanoid } from "nanoid";
import Handlebars from "handlebars";

export interface PropsBlock {
  id?: string;
  className?: string;
  attrs?: Record<string, string>;
  events?: Record<string, EventListener>;
  formState?: Record<string, string>;
  [key: string]: unknown;
}

abstract class Block<Props extends PropsBlock = PropsBlock> {
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  } as const;

  private _element: HTMLElement | null = null;
  private _meta: { tagName: string; props: Props } | null = null;
  private _id: string = nanoid(6);

  protected props: Props;
  protected children: Record<string, Block | Block[]> = {};
  private eventBus: () => EventBus<string>;

  constructor(tagName: string = "div", propsWithChildren: Props) {
    const eventBus = new EventBus<string>();
    this.eventBus = () => eventBus;

    console.log("propsWithChildren", propsWithChildren);

    const { props, children } = this._getChildrenAndProps(propsWithChildren);
    this.children = children;

    this._meta = {
      tagName,
      props: props as Props,
    };

    this.props = this._makePropsProxy(props as Props);

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus<string>) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources() {
    if (!this._meta) return;

    const { tagName, props } = this._meta;
    this._element = this._createDocumentElement(tagName);
    if (typeof props.className === "string") {
      const classes = props.className.split(" ");
      this._element.classList.add(...classes);
    }

    const attrs = props.attrs as Record<string, string> | undefined;
    if (attrs) {
      Object.entries(attrs).forEach(([attrName, attrValue]) => {
        if (this._element) {
          this._element.setAttribute(attrName, attrValue);
        }
      });
    }
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _getChildrenAndProps(propsAndChildren: Props) {
    const children: Record<string, Block | Block[]> = {};
    const props: Record<string, unknown> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        children[key] = value.filter((v) => v instanceof Block) as Block[];
        props[key] = value.filter((v) => !(v instanceof Block));
      } else if (value instanceof Block) {
        children[key] = value as Block;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  private _componentDidMount() {
    this.componentDidMount();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected componentDidMount(_oldProps?: Props) {
    return true;
  }

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: Props, newProps: Props) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected componentDidUpdate(_oldProps: Props, _newProps: Props) {
    // eslint-disable-line @typescript-eslint/no-unused-vars
    return true;
  }

  setProps = (nextProps: Partial<PropsBlock>) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _addEvents() {
    const events: Record<string, EventListener> = this.props.events || {};

    Object.keys(events).forEach((eventName) => {
      if (this._element) {
        this._element.addEventListener(eventName, events[eventName]);
      }
    });
  }

  private _removeEvents() {
    const events: Record<string, EventListener> = this.props.events || {};

    Object.keys(events).forEach((eventName) => {
      if (this._element) {
        this._element.removeEventListener(eventName, events[eventName]);
      }
    });
  }

  private _compile(): DocumentFragment {
    const propsAndStubs: Record<string, unknown> = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        (propsAndStubs as Record<string, unknown>)[key] = child.map(
          (component) => `<div data-id="${component._id}"></div>`,
        );
      } else {
        propsAndStubs[key] = `<div data-id="${(child as Block)._id}"></div>`;
      }
    });

    const fragment = this._createDocumentElement(
      "template",
    ) as HTMLTemplateElement;
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component._id}"]`,
          );

          stub?.replaceWith(component.getContent());
        });
      } else {
        const stub = fragment.content.querySelector(
          `[data-id="${(child as Block)._id}"]`,
        );

        stub?.replaceWith(child.getContent());
      }
    });

    return fragment.content;
  }

  private _render() {
    this._removeEvents();
    const block = this._compile();

    if (this._element) {
      if (this._element.children.length === 0) {
        this._element.appendChild(block);
      } else {
        this._element.replaceChildren(block);
      }
    }

    this._addEvents();
  }

  render(): string {
    return "";
  }

  getContent(): HTMLElement {
    if (!this.element) {
      throw new Error("Element is not initialized");
    }
    return this.element;
  }

  private _makePropsProxy(props: Props): Props {
    const eventBus = this.eventBus();
    const emitBind = eventBus.emit.bind(eventBus);

    return new Proxy(props, {
      get(target: Props, prop: string) {
        const value = target[prop as keyof Props];
        return typeof value === "function"
          ? (value as (...args: unknown[]) => unknown).bind(target)
          : value;
      },
      set(target: Props, prop: string, value: unknown): boolean {
        const oldTarget = { ...target };
        target[prop as keyof Props] = value as Props[keyof Props];

        emitBind(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty(): boolean {
        throw new Error("Нет доступа");
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  show() {
    this.getContent().style.display = "block";
  }

  hide() {
    this.getContent().style.display = "none";
  }

  get id() {
    return this._id;
  }
}

export default Block;
