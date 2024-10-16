import { Router } from "@/app/Router";
import { View } from "@/app/View";
import { SignupForm } from "@/widgets/SignUp";

/**
 * Class provides render signup form
 */
export class SignupPage extends View{
  #root = document.getElementById("root")!;
  #router
  constructor(router : Router) {
    super();
    this.#router = router;
  }

  /**
   * render signup page
   * @param {} nick
   * @returns {}
   */
  render() {
    const form = new SignupForm(this.#root, this.#router);
    form.render();
  }
}
