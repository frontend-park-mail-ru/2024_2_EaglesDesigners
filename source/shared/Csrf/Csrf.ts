class CSRF {
  #csrfToken: string;
  constructor() {
    this.#csrfToken = "";
  }

  get() {
    return this.#csrfToken;
  }

  set(csrf: string) {
    this.#csrfToken = csrf;
  }
}

export const Csrf = new CSRF();
