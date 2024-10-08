import { LoginForm } from "../../widgets/loginForm/loginForm.js";

/**
 * Class provides render login form
 */
export class RenderLogin {
  #parent;
  constructor(parent) {
    this.#parent = parent;
  }
  /**
   * render login page
   * @param {}
   * @returns {}
   */
  render() {
    const form = new LoginForm(this.#parent);

    form.renderTemplate();
  }
}
