import { serverHost } from "@/app/config";
import { ResponseError } from "./types";
import { Csrf } from "../Csrf/Csrf";

/**
 * API class provides API-functions.
 */
class Api {
  #baseURl: string;
  constructor(baseUrl: string) {
    this.#baseURl = baseUrl;
  }

  /**
   * get request method api
   * @param {string} path - url for request
   * if could not fetch, return error
   * @returns {json} response from server
   */
  async get<TResponse>(path: string) {
    type Response = TResponse & ResponseError;
    try {
      const url = this.#baseURl + path;
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Credentials": "true",
        },
        credentials: "include",
      });
      const CSRFToken =
        response.headers.get("x-csrf-token") ?? localStorage.getItem("csrf");
      if (CSRFToken) {
        Csrf.set(CSRFToken);
      }

      const body: Response = await response.json();
      return body;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }

  /**
   * post request method api
   * @param {string, json} path - url for request, body - body of request
   * if could not fetch, return error
   * @returns {json} response from server
   */
  async post<TResponse, TRequest>(path: string, body: TRequest) {
    type Response = TResponse & ResponseError;
    try {
      const url = this.#baseURl + path;
      const state: RequestInit = {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          not_csrf: Csrf.get(),
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
        credentials: "include",
      };

      const response = await fetch(url, state);
      const CSRFToken =
        response.headers.get("x-csrf-token") ?? localStorage.getItem("csrf");
      if (CSRFToken) {
        Csrf.set(CSRFToken);
        localStorage.setItem("csrf", Csrf.get());
      }

      const responseBody: Response = await response.json();
      return responseBody;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }

  async postFormData<TResponse>(path: string, formData: FormData) {
    type Response = TResponse & ResponseError;

    try {
      const url = this.#baseURl + path;
      const CSRFToken = Csrf.get() ?? localStorage.getItem("csrf");
      const state: RequestInit = {
        method: "POST",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          enctype: "multipart/form-data",
          not_csrf: CSRFToken,
        },
        mode: "cors",
        body: formData,
        credentials: "include",
      };
      if (CSRFToken) {
        Csrf.set(CSRFToken);
      }

      const response = await fetch(url, state);
      const responseBody: Response = await response.json();
      return responseBody;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }

  async putFormData<TResponse>(path: string, formData: FormData) {
    type Response = TResponse & ResponseError;
    try {
      const url = this.#baseURl + path;

      const state: RequestInit = {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          enctype: "multipart/form-data",
          not_csrf: Csrf.get(),
        },
        mode: "cors",
        body: formData,
        credentials: "include",
      };
      const response = await fetch(url, state);
      const CSRFToken =
        response.headers.get("x-csrf-token") ?? localStorage.getItem("csrf");
      if (CSRFToken) {
        Csrf.set(CSRFToken);
        localStorage.setItem("csrf", Csrf.get());
      }
      const responseBody: Response = await response.json();
      return responseBody;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }
  async put<TResponse, TRequest>(path: string, body: TRequest ) {
    type Response = TResponse & ResponseError;
    try {
      const url = this.#baseURl + path;

      const state: RequestInit = {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          enctype: "multipart/form-data",
          not_csrf: Csrf.get(),
        },
        mode: "cors",
        body: JSON.stringify(body),
        credentials: "include",
      };
      const response = await fetch(url, state);
      const CSRFToken =
        response.headers.get("x-csrf-token") ?? localStorage.getItem("csrf");
      if (CSRFToken) {
        Csrf.set(CSRFToken);
        localStorage.setItem("csrf", Csrf.get());
      }
      const responseBody: Response = await response.json();
      return responseBody;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }

  async delete<TResponse>(path: string, body: string) {
    type Response = TResponse & ResponseError;
    try {
      const url = this.#baseURl + path;
      const state: RequestInit = {
        method: "DELETE",
        body: body,
        headers: {
          not_csrf: Csrf.get(),
        },
        mode: "cors",
        credentials: "include",
      };

      const response = await fetch(url, state);
      const CSRFToken =
        response.headers.get("x-csrf-token") ?? localStorage.getItem("csrf");
      if (CSRFToken) {
        Csrf.set(CSRFToken);
        localStorage.setItem("csrf", Csrf.get());
      }
      const responseBody: Response = await response.json();
      return responseBody;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }
}

export const API = new Api(serverHost);
