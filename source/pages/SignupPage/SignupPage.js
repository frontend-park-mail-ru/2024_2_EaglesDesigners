import { SignupForm } from "../../widgets/SignUp/signUpForm.js";

export class RenderSignup {
  #root = document.getElementById("root");
  constructor() {}

  render() {
    const form = new SignupForm(this.#root);
    form.renderTemplate();
  }
}
