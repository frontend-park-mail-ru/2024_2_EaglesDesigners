import { LoginForm } from "@/widgets/loginForm";
import "./index.scss";
import { View } from "@/app/View";
import { Router } from "@/shared/Router";
import { AuthResponse, EmptyRequest, EmptyResponse } from "@/shared/api/types";
import { API } from "@/shared/api/api";

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
  async render() {
    const response = await API.get<AuthResponse>("/auth");
    if (!response.error){
      const responseAuth = await API.post<EmptyResponse, EmptyRequest>("/logout", {});
      if (responseAuth.error) {
        return
      }
    }
    //this.#router.go('/login');
    const form = new LoginForm(this.#parent, this.#router);

    form.render();
  }
}
