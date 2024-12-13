import MessageMenuTemplate from "./MessageMenu.handlebars";
import "./MessageMenu.scss";
import { DeleteMessage } from "@/feature/DeleteMessage";

export class MessageMenu {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(messageId : string, messageText : string, x : number, y : number, branch : boolean = false) {
        this.#parent.innerHTML = MessageMenuTemplate({x, y});
        const deleteButton = this.#parent.querySelector("#delete-message")!;

        const handleDelete = async () => {
            const deleteMessageMenu = new DeleteMessage(this.#parent);
            deleteMessageMenu.render(messageId);
        };

        deleteButton.addEventListener("click", handleDelete);

        const editButton = this.#parent.querySelector("#edit-message")!;
        let textArea : HTMLTextAreaElement;
        console.log(branch)
        if (branch === false) {
          textArea = document.querySelector("#textarea")!;
        }
        else {
          textArea = document.getElementById('branch-textarea')!;
        }
        
        
        const handleEdit = () => {
          console.log(textArea)
            textArea.classList.remove(textArea.classList[1]);
            textArea.classList.remove(textArea.classList[1]);
            textArea.classList.add("edit");
            textArea.classList.add(messageId);
            textArea.value = messageText.trim();
            this.#parent.innerHTML = '';
        };
        editButton.addEventListener("click", handleEdit);
        
        const handlerClickOutsideModal = (e: Event) => {
            if (e.target instanceof Element) {
              if (e.target.className === "modal") {
                this.#parent.innerHTML = "";
              }
            }
          };
      
          document.addEventListener("click", handlerClickOutsideModal);
    }
}