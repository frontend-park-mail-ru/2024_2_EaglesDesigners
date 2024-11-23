import { View } from "@/app/View";
import StatisticPageTemplate from "./StatisticPage.handlebars";
import "./StatisticPage.scss";
import { StatisticCard } from "@/entities/StatisticCard/ui/StatisticCard";

export class StatisticPage extends View {
    #parent : HTMLElement = document.getElementById("root")!;
    constructor() {
        super();
    }

    render(){
        this.#parent.innerHTML = StatisticPageTemplate();

        const statisticValue : HTMLElement = this.#parent.querySelector("#statistic-value-topic")!;
        const question = [{question: "Как дела?", value: 5}, {question: "Как дела?", value: 5}, {question: "Как дела?", value: 5}, {question: "Как дела?", value: 5}, {question: "Как дела?", value: 5},];
        const statisticCard = new StatisticCard(statisticValue);
        question.forEach((element) => {
            statisticCard.render(element.question, element.value);
        });
    }
}