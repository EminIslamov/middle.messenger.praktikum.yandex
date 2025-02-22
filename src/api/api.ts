const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

function queryStringify(
  data: Record<string, string | number | boolean>,
): string {
  if (typeof data !== "object") {
    throw new Error("Data must be object");
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${data[key]}${index < keys.length - 1 ? "&" : ""}`;
  }, "?");
}

type Options = {
  headers?: Record<string, string>;
  timeout?: number;
  data?: Record<string, string | number | boolean>;
}

type HTTPMethod<R = XMLHttpRequest> = (url: string, options?: Options) => Promise<R>;

export class HTTPTransport {
  get: HTTPMethod = (url, options: Options = {}) => (
    this.request(url, {...options, method: METHODS.GET}, options.timeout) as Promise<XMLHttpRequest>
  )

  put: HTTPMethod = (url, options: Options = {}) => (
    this.request(url, {...options, method: METHODS.PUT}, options.timeout) as Promise<XMLHttpRequest>
  )

  post: HTTPMethod = (url, options: Options = {}) => (
    this.request(url, {...options, method: METHODS.POST}, options.timeout) as Promise<XMLHttpRequest>
  )

  delete: HTTPMethod = (url, options: Options = {}) => (
    this.request(url, {...options, method: METHODS.DELETE}, options.timeout) as Promise<XMLHttpRequest>
  )

  request = (
    url: string,
    options: {
      headers?: Record<string, string>;
      method?: string;
      data?: Record<string, string | number | boolean>;
    } = {},
    timeout: number = 5000,
  ) => {
    const { headers = {}, method, data } = options;

    return new Promise(function (resolve, reject) {
      if (!method) {
        reject("No method");
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };
}
