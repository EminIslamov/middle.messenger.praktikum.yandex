import Block, { PropsBlock } from "./block";
import { render } from "./renderDom";
import { AuthController } from "../controllers/AuthController"; // убедись, что он есть


// Добавляем новый тип для параметров маршрута
type RouteParams = Record<string, string>;

function getRouteParams(pattern: string, pathname: string): RouteParams | null {
  // Преобразуем шаблон маршрута в регулярное выражение
  const paramNames: string[] = [];
  const regexPattern = pattern.replace(/:([^/]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return "([^/]+)";
  });
  const regex = new RegExp(`^${regexPattern}$`);

  // Проверяем совпадение
  const match = pathname.match(regex);
  if (!match) {
    return null;
  }

  // Собираем параметры
  const params: RouteParams = {};
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });

  return params;
}

type RouteProps = {
  rootQuery: string;
  isPrivate?: boolean;
  isPublicOnly?: boolean;
};

class Route<P extends PropsBlock = PropsBlock> {
  private _pathname: string;
  private _blockClass: new () => Block<P>;
  private _block: Block<P> | null = null;
  private _props: { rootQuery: string; isPrivate?: boolean; isPublicOnly?: boolean };

  constructor(pathname: string, view: new () => Block<P>, props: { rootQuery: string; isPrivate?: boolean; isPublicOnly?: boolean }) {
    this._pathname = pathname;
    this._blockClass = view;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render(pathname);
    }
  }

  leave() {
    if (this._block) {
      const content = this._block.getContent();
      if (content && content.parentNode) {
        content.parentNode.removeChild(content);
      }
      this._block = null;
    }
  }

  match(pathname: string) {
    // Преобразуем шаблон маршрута в регулярное выражение
    const pattern = this._pathname.replace(/:([^/]+)/g, "([^/]+)");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(pathname);
  }

  render(pathname: string) {
    if (!this._block) {
      this._block = new this._blockClass();

      // Получаем параметры маршрута
      const params = getRouteParams(this._pathname, pathname);
      if (params && this._block.setProps) {
        this._block.setProps({ routeParams: params });
      }

      render(this._props.rootQuery, this._block);
    } else {
      this._block.show();
    }
  }

  get isPrivate() {
    return this._props.isPrivate;
  }

  get isPublicOnly() {
    return this._props.isPublicOnly;
  }

  get pathname() {
    return this._pathname;
  }
}

export class Router {
  private static __instance: Router;
  private routes: Route<PropsBlock>[] = [];
  private history: History = window.history;
  private _currentRoute: Route<PropsBlock> | null = null;
  private _rootQuery: string;

  constructor(rootQuery: string) {
    this._rootQuery = rootQuery;

    if (Router.__instance) {
      return Router.__instance;
    }

    Router.__instance = this;
  }

  use<P extends PropsBlock>(pathname: string, block: new () => Block<P>, props: Partial<RouteProps> = {}) {
    const route = new Route<P>(pathname, block, {
      rootQuery: this._rootQuery,
      ...props,
    });
    this.routes.push(route);
    return this;
  }

  async start() {
    window.onpopstate = (event) => {
      const target = event.currentTarget as Window;
      if (target) {
        this._onRoute(target.location.pathname);
      }
    };

    await this._onRoute(window.location.pathname);
  }

  async _onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (!route) {
      this.go("/404");
      return;
    }

    try {
      await AuthController.getUser(); // если пользователь не авторизован — будет ошибка
      if (route.isPublicOnly) {
        this.go("/messenger");
        return;
      }
    } catch (e) {
      console.error(e)
      if (route.isPrivate) {
        this.go("/");
        return;
      }
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    this._currentRoute.render(pathname);
  }

  go(pathname: string) {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }
}
