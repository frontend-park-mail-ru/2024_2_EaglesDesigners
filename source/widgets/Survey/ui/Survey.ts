import SurveyTemplate from "./Survey.handlebars";
import "./Survey.scss";
import { API } from "@/shared/api/api";
import { SurveyResponse } from "@/shared/api/types";
import { TSurveyAnswer, TSurveyQuestion } from "../model/type";

export class Survey {
    #parent;
    #survey_id: string;
    #topic: string;
    #questions: TSurveyQuestion[];
    #answers: TSurveyAnswer[];

    constructor(parent : HTMLElement) {
        this.#parent = parent;
        this.#survey_id = "";
        this.#topic = "";
        this.#questions = [];
        this.#answers = [];
    }

    async render(){
        const response = await API.get<SurveyResponse>('survey/main');
        this.#topic = "Опрос";
        this.#survey_id = "1451512512512";
        this.#questions = [ 
            {
                question: "Как вам наше приложение??",
                id: "125151251",
                type: "Звезды",
            },
            {
                question: "Я жил на триллионах планет",
                id: "125151251",
                type: "Звезды",
            },
            {
                question: "Камеру вырубай",
                id: "125151251",
                type: "Звезды",
            },
            {
                question: "Как вам наше приложение??",
                id: "125151251",
                type: "Звезды",
            },
        ]
        
        // if (response.error) {
        //     return;
        // }
        // this.#survey_id = response.survey_id;
        // this.#topic = response.topic;
        // this.#questions = response.questions;

        this.#answers = this.#questions.map(question => ({
           question_id: question.id, 
           text_answer: '',     
           numeric_answer: '' 
       }));

       this.renderQuestion(0);
    }

    renderQuestion(questionNum: number){
        if (questionNum < 0 || questionNum >= this.#questions.length){
            return;
        }

        this.#parent.innerHTML = SurveyTemplate({
            question: {
                ...this.#questions[questionNum],
                last: questionNum === this.#questions.length - 1,
            }
        });

        const stars = this.#parent.querySelectorAll('.survey-star');

        stars.forEach((item, index) => {
            
            item.addEventListener('click', () =>{
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('checked');
                }
                for (let i = index+1; i < stars.length; i++) {
                    stars[i].classList.remove('checked');
                }
                this.#answers[0].numeric_answer = index+1;
            })
        });

        this.#parent.querySelector("#survey-next")?.addEventListener('click', () =>{
            this.renderQuestion(questionNum + 1);
        });
        // this.#parent.querySelector("#survey-send")?.addEventListener('click', () =>{
        //     this.renderQuestion(questionNum + 1);
        // });

    }
}