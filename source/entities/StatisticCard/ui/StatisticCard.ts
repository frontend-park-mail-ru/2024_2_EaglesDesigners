import StatisticCardTemplate from "./StatisticCard.handlebars";
import "./StatisticCard.scss";

export class StatisticCard{
    #parent;
    constructor(parent : HTMLElement) {
        this.#parent = parent;
    }

    render(question : string, value : number) {
        this.#parent.insertAdjacentHTML("beforeend", StatisticCardTemplate({question, value}));

    }
} 