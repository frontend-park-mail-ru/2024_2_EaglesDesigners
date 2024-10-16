import { SignupForm } from "@/widgets/SignUp";

/**
 * Class provides render signup form
 */
export class SignupPage {
  #root = document.getElementById("root")!;
  constructor() {}

  /**
   * render signup page
   * @param {} nick
   * @returns {}
   */
  render() {
    const form = new SignupForm(this.#root);
    form.render();
  }
}
