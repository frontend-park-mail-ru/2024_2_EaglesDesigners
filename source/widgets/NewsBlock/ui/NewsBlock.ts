import NewsBlockTemplate from "./NewsBlock.handlebars";
import "./NewsBlock.scss";

export class NewsBlock{
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = NewsBlockTemplate();
    }
}