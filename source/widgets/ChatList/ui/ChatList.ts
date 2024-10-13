import { API } from "@/shared/api/api.ts";
import { ChatCard } from "@/entities/ChatCard";
import ChatListTemplate from "./ChatList.handlebars";
import "./ChatList.scss";

/**
 * ChatList class provides functions for rendering list of user's chats
 */
export class ChatList {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }
  /**
   * Render ChatList widget
   * @function render
   * @async
   */
  async render() {
    let chats = [{
      "chatId": 1,
      "chatName": "Чат с пользователем 2",
      "chatType": "personalMessages",
      "usersId": [
          1,
          2
      ],
      "lastMessage": "Когда за кофе?",
      "avatarURL": "https://yandex-images.clstorage.net/bVLC53139/667e899dbzgI/Lec3og97oM2J8jgAbwmbs1UEQ_j2WQe6H7Tz0tGHlNUDiLp06xNO9LooehtZCLyucrVfOV3bNS1vNvr_fMoMLbniE8frC6CczUKcwc_ImueU0HKs18lHz490gERWwAOWtD4IttmRuiGPuG9PrfwYeJTUCT5PeyM6mMdYuXvvucreJwTwaprjvy1RSHHf2XlUxVagbjT_Z3s54KP1tiFyt1ZNSQbbE3rzTsqefIsOGIsUYXo-bNgSKZq1WSlJDWhoz9XEo5uL4K6ts3gATet5lVTXMkxWjOY7KIFDVJZywRQU_5pGKzNLwd44T06oTSlJF8LpfEw5cni4VlkKqL3pur7HtGJr6fJM_7N44i2JKwV39mKvRF_0WggAkvaH0qM3dF3rRmhTySM-KU0umyyYWiVw2A7POeGIuvaYeurMKuh91cfSm1uT3gyRmwOOe-pFVEUzzFSupwioEVOHBbBzZ2Tv-6XKcnrQn8kvjEot-5skUlksz1lzKIsGKytJHes6zpeFgbqbE_-fI5hA_TpqVeemkPzm7qcL-UCy5NVyUTYUrfi2K2JIwT85fHzLzVhIFiBIH-9b0Xt45-m5aDwpWu_VtENpCtPcbhE7gL9aisTlNiP8hE2kW1qwEiTkwILXxe9adbgRuvDt6U59ag4qWbVyOm7eG4Nq2QW5mTveSXpcdzTz-TmS_F8iiCEc6Or0JvZy3ldd9-q7MMEWl-FS5YT_GUTZQQqiztuNzust-xr0cJjMzfuSmqqlyvuIPKlJbadlI-l7IS6vUWixLdt6p1dG0dy3bMdYunPBRcWioYYX3BsV2fP7oq26jA6YvgmLxQKqnr_IU0tJJ4greQw5Sp0HhdFYu4DeXGFbEF3JOWb3ZIJvR851WQnhM2UX8VKF983KBAoDOOK9qp1_aC9YK0WCa_8P-UGZ2Eaqy5s9C4qsNofD6Rkg3qyRGCPveNplxMSyzjbctEk5w6C2k"
  },];
    const response = await API.get("/chats");
    if (response.chats) {
      chats = response.chats;
    }

    this.#parent.innerHTML = ChatListTemplate({});

    const chatList = this.#parent.querySelector("#chat-list");
    const chatCard = new ChatCard(chatList);

    chats.map((chat) => {
      chatCard.render(chat);
    });
  }
}
