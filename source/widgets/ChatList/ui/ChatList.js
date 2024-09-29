export class ChatList {
  #parent;

  constructor(parent) {
    this.#parent = parent;
  }

  render() {
    const chat = [
      {
        id: "prop1",
        name: "Борат",
        avatarURL:
          "https://i.pinimg.com/originals/fa/9c/13/fa9c13a52830c584fa8b96dab8652023.jpg",
        lastMessage: "Купи мне деньга",
      },
      {
        id: "prop2",
        name: "Егор Крид",
        avatarURL:
          "https://chpic.su/_data/stickers/a/Avatars_Emoji/Avatars_Emoji_003.webp",
        lastMessage: "Мама мама мама круго голова",
      },
      {
        id: "prop3",
        name: "Коллектор",
        avatarURL:
          "https://chpic.su/_data/stickers/a/Avatars_Emoji/Avatars_Emoji_003.webp",
        lastMessage: "мы тебе дверь снесем слышиш выходи пока можешь",
      },
    ];
    const template = Handlebars.templates.ChatList;
    this.#parent.innerHTML = template({ chat });
  }
}
