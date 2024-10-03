import { SignupForm } from "../../widgets/SignUp/signUpForm.js";

/**
 * Class provides render signup form
 */
export class RenderSignup {
  #root = document.getElementById("root");
  constructor() {}

  /**
   * render signup page
   * @param {} nick
   * @returns {}
   */
  render() {
    const form = new SignupForm(this.#root);
    form.renderTemplate();
  }
}
