import { API } from "@/shared/api/api";
import MessageMenuTemplate from "./MessageMenu.handlebars";
import "./MessageMenu.scss";
import { DeleteMessage } from "@/widgets/DeleteMessage";

export class MessageMenu {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(messageId : string, messageText : string, x : number, y : number) {
        this.#parent.innerHTML = MessageMenuTemplate({x, y});
        const messageMenu = this.#parent.querySelector("#message-menu")!;

        const deleteButton = this.#parent.querySelector("#delete-message")!;

        const handleDelete = async () => {
            const deleteMessageMenu = new DeleteMessage(this.#parent);
            deleteMessageMenu.render(messageId);
            // const response = await API.delete("/messages/" + messageId, messageId);
            // console.log(response);
            // this.#parent.innerHTML = '';
        };

        deleteButton.addEventListener("click", handleDelete);

        const editButton = this.#parent.querySelector("#edit-message")!;
        const textArea = document.querySelector("textarea")!;
        textArea.innerText = "asd";

        const handleEdit = () => {
            textArea.classList.add("edit");
            textArea.classList.add(messageId);
            textArea.innerText = messageText;
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