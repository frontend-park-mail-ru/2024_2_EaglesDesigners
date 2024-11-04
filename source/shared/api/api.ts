import { ProfileRequest, ResponseError } from "./types";
import { localHost, serverHost } from "@/app/config";

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
      const responseBody: Response = await response.json();
      return responseBody;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }

  async putProfile<TResponse>(path: string, body: ProfileRequest) {
    type Response = TResponse & ResponseError;
    try {
      const formData = new FormData();

      const profileData = {
        name: body.name,
        bio: body.bio,
        birthdate: body.birthdate,
      };
      const profileUserDate = JSON.stringify(profileData);

      formData.append("avatar", body.avatar);
      formData.append("profile_data", profileUserDate);

      const url = this.#baseURl + path;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          enctype: "multipart/form-data",
        },
        mode: "cors",
        body: formData,
        credentials: "include",
      });
      const responseBody: Response = await response.json();
      return responseBody;
    } catch {
      return { error: "could not fetch" } as Response;
    }
  }
}

export const API = new Api(localHost);
