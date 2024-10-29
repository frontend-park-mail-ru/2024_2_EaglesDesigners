import ContactAddFromTemplate from "./ContactAddForm.handlebars";
import "./ContactAddForm.scss";

export class ContactAddForm {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render() {
        this.#parent.innerHTML = ContactAddFromTemplate();


        //const confirmButton = 
    }
}