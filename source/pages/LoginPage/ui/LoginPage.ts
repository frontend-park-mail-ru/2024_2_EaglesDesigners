import { LoginForm } from "@/widgets/loginForm";
import "./index.scss";
import { View } from "@/app/View";
import { Router } from "@/shared/Router";

/**
 * Class provides render login form
 */
export class LoginPage extends View {
  #parent = document.getElementById("root")!;
  #router
  constructor(router : Router) {
    super();
    this.#router = router;
  }
  /**
   * render login page
   * @param {}
   * @returns {}
   */
  render() {
    //this.#router.go('/login');
    const form = new LoginForm(this.#parent, this.#router);

    form.render();
  }
}
