import { LoginForm } from "@/widgets/loginForm";
import "./index.scss";
import { View } from "@/app/View";
/**
 * Class provides render login form
 */
export class LoginPage extends View {
  #parent = document.getElementById("root")!;
  constructor() {
    super();
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
