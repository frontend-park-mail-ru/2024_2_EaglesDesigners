import { ResponseError } from "./types";

/**
 * API class provides API-functions.
 */
class Api {
  #baseURl:string;
  constructor(baseUrl:string) {
    this.#baseURl = baseUrl;
  }

  /**
   * get request method api
   * @param {string} path - url for request
   * if could not fetch, return error
   * @returns {json} response from server
   */
  async get<T>(path:string) {
    type Response = {
      [K in keyof T | keyof ResponseError]?: K extends keyof T ? T[K] : K extends keyof ResponseError ? ResponseError[K] : never;
     };
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
  async post<TRequest,TResponse>(path:string, body: TRequest) {
    type Response = {
      [K in keyof T | keyof ResponseError]?: K extends keyof T ? T[K] : K extends keyof ResponseError ? ResponseError[K] : never;
     };
    try {
      const url = this.#baseURl + path;
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      return await response.json();
    } catch {
      return { error: "could not fetch" };
    }
  }
}

export const API = new Api("http://212.233.98.59:8080");
