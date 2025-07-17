import { expect } from "chai";
import { Router } from "./router.js";
import Block from "./block.js";
import sinon from "sinon";
import { AuthController } from "../controllers/AuthController.js";

class TestPage extends Block {
  constructor() {
    super("div", {});
  }
  render(): string {
    return `<div class="test-page">Test Page</div>`;
  }
}

class LoginPage extends Block {
  constructor() {
    super("div", {});
  }
  render(): string {
    return `<div class="login-page">Login Page</div>`;
  }
}

const TEST_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  PROFILE: "/profile/:id",
} as const;

describe("Router", () => {
  let router: Router;
  let originalHistory: History;
  let mockHistory: History;
  let getUserStub: sinon.SinonStub;

  beforeEach(() => {
    // Мокаем window.history ДО создания Router
    originalHistory = window.history;
    mockHistory = {
      pushState: () => {},
      back: () => {},
      forward: () => {},
      go: () => {},
      replaceState: () => {},
      length: 1,
      scrollRestoration: "auto",
      state: null,
    } as History;
    Object.defineProperty(window, "history", {
      value: mockHistory,
      writable: true,
    });

    // Мокаем AuthController.getUser для всех тестов
    getUserStub = sinon.stub(AuthController, "getUser").resolves({
      id: 1,
      login: "testuser",
      first_name: "Test",
      second_name: "User",
      display_name: "Test User",
      email: "test@example.com",
      phone: "+1234567890",
    });

    // Добавляем #app в DOM для рендера
    const appDiv = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    router = new Router("#app");
  });

  afterEach(() => {
    Object.defineProperty(window, "history", {
      value: originalHistory,
      writable: true,
    });
    getUserStub.restore();

    // Удаляем #app из DOM
    const appDiv = document.getElementById("app");
    if (appDiv) appDiv.remove();
  });

  describe("Route Registration", () => {
    it("should register routes correctly", () => {
      router.use(TEST_ROUTES.HOME, TestPage);
      router.use(TEST_ROUTES.LOGIN, LoginPage);
    });

    it("should support method chaining", () => {
      const result = router
        .use(TEST_ROUTES.HOME, TestPage)
        .use(TEST_ROUTES.LOGIN, LoginPage);
      void expect(result).to.equal(router);
    });
  });

  describe("Route Finding", () => {
    beforeEach(() => {
      router.use(TEST_ROUTES.HOME, TestPage);
      router.use(TEST_ROUTES.PROFILE, TestPage);
    });

    it("should find exact route", () => {
      void expect(router.getRoute("/")).to.exist;
    });

    it("should find route with parameters", () => {
      const route = router.getRoute("/profile/123");
      void expect(route).to.exist;
      if (route) {
        void expect(route.pathname).to.equal(TEST_ROUTES.PROFILE);
      }
    });

    it("should return undefined for non-existent route", () => {
      const route = router.getRoute("/non-existent");
      void expect(route).to.be.undefined;
    });
  });

  describe("Route Properties", () => {
    it("should handle private routes", () => {
      router.use("/private", TestPage, { isPrivate: true });
      const route = router.getRoute("/private");
      void expect(route).to.exist;
      if (route) {
        void expect(route.isPrivate).to.be.true;
      }
    });

    it("should handle public-only routes", () => {
      router.use("/public", TestPage, { isPublicOnly: true });
      const route = router.getRoute("/public");
      void expect(route).to.exist;
      if (route) {
        void expect(route.isPublicOnly).to.be.true;
      }
    });

    it("should handle routes without special properties", () => {
      router.use("/normal", TestPage);
      const route = router.getRoute("/normal");
      void expect(route).to.exist;
      if (route) {
        void expect(route.isPrivate).to.be.undefined;
        void expect(route.isPublicOnly).to.be.undefined;
      }
    });
  });

  describe("Singleton Pattern", () => {
    it("should return same instance", () => {
      const router1 = new Router("#app");
      const router2 = new Router("#app");
      void expect(router1).to.equal(router2);
    });
  });

  describe("Route Parameters", () => {
    it("should match routes with parameters", () => {
      router.use("/user/:id/profile", TestPage);
      const route = router.getRoute("/user/123/profile");
      void expect(route).to.exist;
      if (route) {
        void expect(route.pathname).to.equal("/user/:id/profile");
      }
    });
  });
});
