import "./Notification.scss";
import NotificationTemplate from "./Notification.handlebars"; 

class Notification {
    #parent;
    constructor() {
        this.#parent = document.getElementById("root")!;
        
    }

    render() {
        this.#parent.insertAdjacentHTML("beforeend", NotificationTemplate());

        const cancelNotification = this.#parent.querySelector("#cancel-notification")!;

        const handleCancel = () => {
            this.hide();
        };

        cancelNotification.addEventListener("click", handleCancel);
    }

    show() {
        const notification : HTMLElement = this.#parent.querySelector("#notification")!;
        notification.classList.remove("hide");

        setTimeout(() => {
            notification.classList.add("hide");
        }, 3000);
    }
    hide () {
        const notification : HTMLElement = this.#parent.querySelector("#notification")!;
        notification.classList.add("hide");
    }
}

export const UserNotification = new Notification();