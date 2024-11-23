import { View } from "@/app/View";
import SurveyTemplate from "./Survey.hbs";
import "./Survey.scss";

export class Survey extends View {
    constructor() {
        super();
    }

    render() {
        const parent = document.querySelector('#root')!;
        parent.innerHTML = SurveyTemplate();
        console.log(parent)
        const cancelSurveyButton = parent.querySelector("#cancel")!;
        console.log(cancelSurveyButton)
        const handleCancelSurvey = () => {
            const surveyModal : HTMLElement = parent.querySelector("#survey-modal")!;
            parent.innerHTML = '';
        };
        cancelSurveyButton.addEventListener("click", handleCancelSurvey);
    }
}