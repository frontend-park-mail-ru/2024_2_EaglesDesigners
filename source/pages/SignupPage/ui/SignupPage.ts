import { View } from "@/app/View";
import { SignupForm } from "@/widgets/SignUp";

/**
 * Class provides render signup form
 */
export class SignupPage extends View {
  #root = document.getElementById("root")!;
  constructor() {
    super();
  }

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
