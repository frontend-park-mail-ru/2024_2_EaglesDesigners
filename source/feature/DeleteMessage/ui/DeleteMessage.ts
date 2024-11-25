import { API } from "@/shared/api/api";
import DeleteMessageForm from "./DeleteMessage.handlebars";
import "./DeleteMessage.scss";

export class DeleteMessage {
    #parent;
    constructor(parent : Element) {
        this.#parent = parent;
    }

    render(messageId : string) {
        this.#parent.innerHTML = DeleteMessageForm();

        const cancelButton = this.#parent.querySelector("#cancel-btn")!;

        const handleCancel = () => {
            this.#parent.innerHTML = '';
        };
        cancelButton.addEventListener("click", handleCancel);

        const deleteButton = this.#parent.querySelector("#delete-btn")!;

        const handleDelete = async () => {
            const response = await API.delete(`/messages/${messageId}`, messageId);
            if (!response.error) {
                this.#parent.innerHTML = '';
                const deletedMessage = document.querySelector(`[id='${messageId}']`)!;
                
                deletedMessage.remove();
            }
            else {
                const spanDelete = this.#parent.querySelector("#span-error-delete")!;
                spanDelete.textContent = "Вы не можете удалять чужие сообщения";

            }
        };
        deleteButton.addEventListener('click', handleDelete);
    }
}