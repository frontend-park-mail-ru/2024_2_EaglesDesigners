import { View } from "@/app/View";
import SurveyTemplate from "./Survey.hbs";
import "./Survey.scss";

export class Survey extends View {
    constructor() {
        super();
    }

    render() {
      const parent = document.querySelector('#survey')!;
      parent.innerHTML = SurveyTemplate();
    }
}