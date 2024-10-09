import { LoginForm } from "../../../widgets/loginForm/ui/loginForm.js";

/**
 * Class provides render login form
 */
export class LoginPage {
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

    form.render();
  }
}
