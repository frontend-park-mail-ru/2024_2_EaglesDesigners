import NewsFormTemplate from "./NewsForm.handlebars";
import "./NewsForm.scss";

export class NewsForm{
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = NewsFormTemplate();
    }
}