import { Router } from "@/shared/Router";
import { View } from "@/app/View";
import { SignupForm } from "@/widgets/SignUp";
import { API } from "@/shared/api/api";
import { AuthResponse, EmptyRequest, EmptyResponse } from "@/shared/api/types";

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
  async render() {
    const response = await API.get<AuthResponse>('/auth');
    if (!response.error) {
      const responseAuth = await API.post<EmptyResponse, EmptyRequest>('/logout', {});
      if (responseAuth.error) {
        return;
      }
    }

    const form = new SignupForm(this.#root, this.#router);
    form.render();
  }
}
