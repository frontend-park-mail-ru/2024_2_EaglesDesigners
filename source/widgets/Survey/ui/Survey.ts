import SurveyTemplate from "./Survey.handlebars";
import "./Survey.scss";

export class Survey {
    #parent;
    constructor(parent : HTMLElement) {
        this.#parent = parent;
    }

    render(){
        this.#parent.innerHTML = SurveyTemplate();
    }
}