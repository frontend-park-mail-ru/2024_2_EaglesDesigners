import { Survey } from "./widgets/Survey";
import "@/app/ui/index.scss";

console.log("allll");
const parent = document.querySelector('#root')!;
const survey = new Survey(parent);
survey.render();