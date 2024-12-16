import { formatBytes } from "@/shared/helpers/formatBytes";
import AttachmentCardTemplate from "./AttachmentCard.handlebars";
import "./AttachmentCard.scss";

export class AttachmentCard {
    #parent;
  
    constructor(parent: HTMLElement) {
      this.#parent = parent;
    }
  
    renderPhoto(photo: File) {
        this.#parent.insertAdjacentHTML(
            "afterbegin",
            AttachmentCardTemplate({
              photo: {
                url: URL.createObjectURL(photo)
              },
            }),
        );
    //     const file = {
    //         'type': 'photo',
    //         ''
    //     }
    // let avatar;
    // if (chat.avatarPath !== "") {
    // avatar = serverHost + chat.avatarPath;
    // } else {
    // avatar = "/assets/image/default-avatar.svg";
    // }
    }

    renderFile(file: File) {
        const regex1 = /\.([^.]+)$/;
        const regex2 = /^(.+)\.[^.]+$/;

        this.#parent.insertAdjacentHTML(
            "afterbegin",
            AttachmentCardTemplate({
              file: {
                // type: file.name.split('.').pop()!.toUpperCase(),
                type: regex1.exec(file.name)![1].toUpperCase(),
                size: formatBytes(file.size),
                name: regex2.exec(file.name)![1]
              },
            }),
        );
    }
}