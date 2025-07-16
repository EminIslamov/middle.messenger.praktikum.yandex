import { expect } from "chai";
import { HTTPTransport } from "./api.js";

type MockXMLHttpRequest = {
  open: (method: string, url: string) => void;
  send: (data?: string | FormData) => void;
  setRequestHeader: (header: string, value: string) => void;
  withCredentials: boolean;
  timeout: number;
  onload: (() => void) | null;
  onerror: (() => void) | null;
  onabort: (() => void) | null;
  ontimeout: (() => void) | null;
  status: number;
  responseText: string;
  readyState: number;
};

type GlobalWithXMLHttpRequest = typeof globalThis & {
  XMLHttpRequest: new () => XMLHttpRequest;
};

describe("HTTPTransport", () => {
  let httpTransport: HTTPTransport;
  let mockXHR: MockXMLHttpRequest;
  let originalXMLHttpRequest: typeof XMLHttpRequest | undefined;

  beforeEach(() => {
    // Сохраняем оригинальный XMLHttpRequest
    originalXMLHttpRequest = (globalThis as GlobalWithXMLHttpRequest)
      .XMLHttpRequest;

    // Создаем мок XMLHttpRequest
    mockXHR = {
      open: () => {},
      send: () => {},
      setRequestHeader: () => {},
      withCredentials: false,
      timeout: 0,
      onload: null,
      onerror: null,
      onabort: null,
      ontimeout: null,
      status: 200,
      responseText: '{"success": true}',
      readyState: 4,
    };

    // Заменяем глобальный XMLHttpRequest на мок
    (globalThis as GlobalWithXMLHttpRequest).XMLHttpRequest = function () {
      return mockXHR as unknown as XMLHttpRequest;
    } as unknown as typeof XMLHttpRequest;

    httpTransport = new HTTPTransport();
  });

  afterEach(() => {
    // Восстанавливаем оригинальный XMLHttpRequest
    if (originalXMLHttpRequest) {
      (globalThis as GlobalWithXMLHttpRequest).XMLHttpRequest =
        originalXMLHttpRequest;
    }
  });

  describe("GET requests", () => {
    it("should make GET request without data", async () => {
      let openCalled = false;
      let sendCalled = false;

      mockXHR.open = (method: string, url: string) => {
        openCalled = true;
        expect(method).to.equal("GET");
        expect(url).to.equal("/api/test");
      };

      mockXHR.send = () => {
        sendCalled = true;
        if (mockXHR.onload) mockXHR.onload();
      };

      const promise = httpTransport.get("/api/test");
      void expect(openCalled).to.be.true;
      void expect(sendCalled).to.be.true;

      const response = await promise;
      void expect(response.status).to.equal(200);
    });

    it("should make GET request with query parameters", async () => {
      let openCalled = false;
      const testData = { name: "test", value: 123 };

      mockXHR.open = (method: string, url: string) => {
        openCalled = true;
        expect(method).to.equal("GET");
        expect(url).to.equal("/api/test?name=test&value=123");
      };

      mockXHR.send = () => {
        if (mockXHR.onload) mockXHR.onload();
      };

      await httpTransport.get("/api/test", { data: testData });
      void expect(openCalled).to.be.true;
    });
  });

  describe("POST requests", () => {
    it("should make POST request with JSON data", async () => {
      let openCalled = false;
      let sendCalled = false;
      let setHeaderCalled = false;
      const testData = { name: "test", value: 123 };

      mockXHR.open = (method: string, url: string) => {
        openCalled = true;
        expect(method).to.equal("POST");
        expect(url).to.equal("/api/test");
      };

      mockXHR.setRequestHeader = (header: string, value: string) => {
        setHeaderCalled = true;
        expect(header).to.equal("Content-Type");
        expect(value).to.equal("application/json");
      };

      mockXHR.send = (data?: string | FormData) => {
        sendCalled = true;
        expect(data).to.equal(JSON.stringify(testData));
        if (mockXHR.onload) mockXHR.onload();
      };

      await httpTransport.post("/api/test", {
        headers: { "Content-Type": "application/json" },
        data: testData,
      });

      void expect(openCalled).to.be.true;
      void expect(sendCalled).to.be.true;
      void expect(setHeaderCalled).to.be.true;
    });

    it("should make POST request with FormData", async () => {
      let sendCalled = false;
      const formData = new FormData();
      formData.append("file", new Blob(["test"]));

      mockXHR.send = (data?: string | FormData) => {
        sendCalled = true;
        expect(data).to.equal(formData);
        if (mockXHR.onload) mockXHR.onload();
      };

      await httpTransport.post("/api/upload", {
        data: formData,
        isFormData: true,
      });

      void expect(sendCalled).to.be.true;
    });
  });

  describe("PUT requests", () => {
    it("should make PUT request", async () => {
      let openCalled = false;
      const testData = { id: 1, name: "updated" };

      mockXHR.open = (method: string, url: string) => {
        openCalled = true;
        expect(method).to.equal("PUT");
        expect(url).to.equal("/api/test/1");
      };

      mockXHR.send = () => {
        if (mockXHR.onload) mockXHR.onload();
      };

      await httpTransport.put("/api/test/1", { data: testData });
      void expect(openCalled).to.be.true;
    });
  });

  describe("DELETE requests", () => {
    it("should make DELETE request", async () => {
      let openCalled = false;

      mockXHR.open = (method: string, url: string) => {
        openCalled = true;
        expect(method).to.equal("DELETE");
        expect(url).to.equal("/api/test/1");
      };

      mockXHR.send = () => {
        if (mockXHR.onload) mockXHR.onload();
      };

      await httpTransport.delete("/api/test/1");
      void expect(openCalled).to.be.true;
    });
  });

  describe("Error handling", () => {
    it("should handle network errors", async () => {
      mockXHR.send = () => {
        if (mockXHR.onerror) mockXHR.onerror();
      };

      try {
        await httpTransport.get("/api/test");
        expect.fail("Should have thrown an error");
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        // Ожидаем ошибку
      }
    });

    it("should handle timeout errors", async () => {
      mockXHR.send = () => {
        if (mockXHR.ontimeout) mockXHR.ontimeout();
      };

      try {
        await httpTransport.get("/api/test", { timeout: 1000 });
        expect.fail("Should have thrown an error");
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }
    });

    it("should handle abort errors", async () => {
      mockXHR.send = () => {
        if (mockXHR.onabort) mockXHR.onabort();
      };

      try {
        await httpTransport.get("/api/test");
        expect.fail("Should have thrown an error");
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }
    });
  });

  describe("Request configuration", () => {
    it("should set withCredentials to true", () => {
      mockXHR.send = () => {
        if (mockXHR.onload) mockXHR.onload();
      };

      httpTransport.get("/api/test");
      void expect(mockXHR.withCredentials).to.be.true;
    });

    it("should set timeout", () => {
      const customTimeout = 10000;
      mockXHR.send = () => {
        if (mockXHR.onload) mockXHR.onload();
      };

      httpTransport.get("/api/test", { timeout: customTimeout });
      void expect(mockXHR.timeout).to.equal(customTimeout);
    });

    it("should set custom headers", () => {
      let headerSet = false;
      const customHeaders = {
        Authorization: "Bearer token",
        "X-Custom": "value",
      };

      mockXHR.setRequestHeader = (header: string, value: string) => {
        headerSet = true;
        expect(customHeaders[header as keyof typeof customHeaders]).to.equal(
          value,
        );
      };

      mockXHR.send = () => {
        if (mockXHR.onload) mockXHR.onload();
      };

      httpTransport.get("/api/test", { headers: customHeaders });
      void expect(headerSet).to.be.true;
    });
  });
});
